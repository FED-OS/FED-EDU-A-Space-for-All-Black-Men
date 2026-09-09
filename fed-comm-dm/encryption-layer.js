/* Fed-Comm DM — Encryption Layer
 * Plain terms: THE LOCK. Takes a message, scrambles it with the shared
 * passphrase inside YOUR browser, and hands back a locked box (base64 text)
 * that's safe to travel. Your brother's browser un-scrambles it with the
 * same passphrase. The passphrase itself NEVER travels — it's the key, and
 * keys don't ride in the mail.
 *
 * Method: Web Crypto API (built into every modern browser — no libraries,
 * ADR-001 applies to security code double). PBKDF2 stretches the passphrase
 * into a strong key; AES-GCM encrypts AND authenticates (tamper-evident).
 *
 * Honest scope (see README): defense against snoops, not warrants. Strong
 * privacy for brother-to-brother talk. Not a vault for credentials.
 */

var FedCommCrypto = (function () {
  "use strict";

  /* ---- Constants (deliberately boring and standard) ---- */
  var PBKDF2_ITERATIONS = 310000;   // OWASP 2023+ guidance for PBKDF2-SHA256
  var SALT_BYTES = 16;
  var IV_BYTES = 12;                // AES-GCM standard nonce size

  /* ---- Encoding helpers (text <-> bytes <-> base64) ---- */
  function textToBytes(text) {
    return new TextEncoder().encode(text);
  }
  function bytesToText(bytes) {
    return new TextDecoder().decode(bytes);
  }
  function bytesToB64(bytes) {
    var bin = "";
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }
  function b64ToBytes(b64) {
    var bin = atob(b64);
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  /* ---- Random bytes (the browser's own CSPRNG) ---- */
  function randomBytes(n) {
    var buf = new Uint8Array(n);
    crypto.getRandomValues(buf);
    return buf;
  }

  /* ---- Passphrase -> strong key (PBKDF2 stretching) ----
   * Plain talk: a human passphrase is short; a strong key is long.
   * PBKDF2 is the gym: it works the passphrase 310,000 times so an
   * attacker guessing passphrases has to pay that cost for EVERY guess.
   * A short-but-not-lazy passphrase becomes a real key.
   * The salt is stored WITH the message (that's fine and standard — salt
   * makes each message's key unique even with the same passphrase).
   */
  function deriveKey(passphrase, salt) {
    var baseKey = textToBytes(passphrase);
    return crypto.subtle
      .importKey("raw", baseKey, { name: "PBKDF2" }, false, ["deriveKey"])
      .then(function (imported) {
        return crypto.subtle.deriveKey(
          { name: "PBKDF2", salt: salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
          imported,
          { name: "AES-GCM", length: 256 },
          false,                       // key not extractable — it never leaves the browser's memory
          ["encrypt", "decrypt"]
        );
      });
  }

  /* ---- SEAL: plaintext -> locked box (base64) ----
   * Box format: b64(salt | iv | ciphertext) — one string, travels well,
   * survives JSON, fits in gists, and both brothers decode it identically.
   */
  function seal(plaintext, passphrase) {
    if (!passphrase) {
      return Promise.reject(new Error("No passphrase set — see the README's security model before messaging."));
    }
    var salt = randomBytes(SALT_BYTES);
    var iv = randomBytes(IV_BYTES);
    return deriveKey(passphrase, salt)
      .then(function (key) {
        return crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, textToBytes(plaintext));
      })
      .then(function (cipherBuf) {
        var saltB = new Uint8Array(salt);
        var ivB = new Uint8Array(iv);
        var cipherB = new Uint8Array(cipherBuf);
        var box = new Uint8Array(saltB.length + ivB.length + cipherB.length);
        box.set(saltB, 0);
        box.set(ivB, saltB.length);
        box.set(cipherB, saltB.length + ivB.length);
        return bytesToB64(box);       // the locked box: safe to travel anywhere
      });
  }

  /* ---- OPEN: locked box -> plaintext ----
   * Fails loudly-but-plainly on wrong passphrase or tampering —
   * AES-GCM authentication means a forged box throws instead of
   * decrypting into garbage.
   */
  function open(boxB64, passphrase) {
    if (!passphrase) {
      return Promise.reject(new Error("No passphrase — cannot unlock."));
    }
    var box = b64ToBytes(boxB64);
    if (box.length < SALT_BYTES + IV_BYTES + 16) {
      return Promise.reject(new Error("Box too short — damaged or not a Fed-Comm box."));
    }
    var salt = box.slice(0, SALT_BYTES);
    var iv = box.slice(SALT_BYTES, SALT_BYTES + IV_BYTES);
    var cipher = box.slice(SALT_BYTES + IV_BYTES);
    return deriveKey(passphrase, salt)
      .then(function (key) {
        return crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, cipher);
      })
      .then(function (plainBuf) {
        return bytesToText(new Uint8Array(plainBuf));
      })
      .catch(function () {
        throw new Error("Wrong passphrase or tampered box.");
      });
  }

  /* ---- Self-test: runs on load so a broken browser fails EARLY, not mid-conversation ---- */
  function selfTest() {
    if (!window.crypto || !crypto.subtle) {
      console.warn("FedComm: Web Crypto unavailable — DMs cannot lock. Use a modern browser (Chrome/Firefox/Safari, any year past 2017).");
      return;
    }
    seal("the block stays locked", "test-passphrase-12345")
      .then(function (box) { return open(box, "test-passphrase-12345").then(function (txt) {
        if (txt !== "the block stays locked") throw new Error("round-trip mismatch");
        console.info("FedComm encryption self-test: ✅ passed — your messages will lock properly.");
      }); })
      .then(function () {
        // Negative test: wrong passphrase MUST fail
        return seal("x", "right-pass").then(function (box) {
          return open(box, "wrong-pass").then(function () {
            console.error("FedComm self-test: ❌ wrong passphrase UNLOCKED the box — this browser is unsafe for DMs. Report it: .github/ISSUE_TEMPLATE/bug_report.md");
          }).catch(function () {
            console.info("FedComm wrong-key test: ✅ correctly rejected.");
          });
        });
      })
      .catch(function (err) {
        console.error("FedComm encryption self-test failed:", err.message);
      });
  }

  selfTest();

  /* ---- The public face: two functions, that's it ---- */
  return {
    seal: seal,   // message -> locked box
    open: open    // locked box -> message
  };
})();
