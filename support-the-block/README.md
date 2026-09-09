# SUPPORT THE BLOCK — THE FUNDING ROOM

This folder is where the money side of FED-EDU lives. The block builds with receipts,
and that includes the money. Nothing here is a black box — every dollar in, every
dollar out, logged in the monthly transparency post.

## WHAT THE MONEY IS FOR

The raffle machines are the promise: a real tower, a real laptop, a real phone kit
for brothers who can't buy their own. The money makes that promise real:

**Refurb machines.** Working towers and laptops bought refurbished, wiped clean,
loaded with the FED-EDU starter loadout, and shipped through the safe-shipping
checklist. This is the bulk of the budget.

**Shipping.** Boxes, foam, tape, labels — and international shipping to the diaspora
hubs. A tower to Kingston or Lagos costs more than the tower. The diaspora map is
the mission, so the shipping line item is real.

**Data stipends.** Phone-only brothers learning on EasyTether and 3G. A $25 data
stipend keeps a brother in the program when his data runs out on the 20th of the
month. Cheap, high-impact, tracked in the raffle economy.

**Hub costs.** Library terminals, church basements, barbershop laptops — the
physical places on the diaspora map where brothers without a phone or a PC can
still get in the game. Small costs, real doors opened.

## THE KO-FI BUTTON

`kofi-button.html` is a drop-in support block. Any brother who wants to put a
support button on his own portfolio page copies the marked block, swaps
`YOUR_USERNAME` for his real Ko-fi name, and ships it.

**The placeholder rule:** the button never goes live with `YOUR_USERNAME` still in
it. The build check in `build.yml` greps every shipped page for the placeholder and
fails the build if it finds one. Swap it or it doesn't ship.

Money raised through a brother's button is his unless he says otherwise in the
transparency post — the button is his page, his supporters, his call. The block's
own button raises for the machine fund directly.

## THE RECEIPTS RULE

Ko-fi donations are logged in the monthly transparency post on the boards:

Who gave (handle only, never a real name unless the donor posts it themselves), how
much, what it funded, and what shipped because of it. A donation that funds a tower
gets named in the raffle results file — "this quarter's tower was fueled by
[handle]." The brother who received the machine knows exactly who paid for it. That
is the receipts culture applied to money: every dollar has a face and a destination.

## THE HONEST LIMIT

This is in the raffle economy file and it stays true here: the machines depend on
donations actually coming in. If the Ko-fi runs dry, the quarterly tower raffle
pauses — it does not fake a draw, it does not ship an empty promise. The
transparency post says "no funds this cycle, raffle paused, tickets held." Brothers
keep the tickets they earned. The promise stays honest by being public about its
limits.

## THE FOLDER

`kofi-button.html` — the drop-in button block with the YOUR_USERNAME placeholder
and the swap-or-fail rule.

`archive-and-stash/` — where funded-but-completed items get filed: receipts,
shipping logs, transparency post drafts, closed raffle cycles. The record of what
the block's money actually did, quarter after quarter.
