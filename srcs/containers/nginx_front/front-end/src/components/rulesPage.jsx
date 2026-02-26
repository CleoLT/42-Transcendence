import { IconsOverlayFrame } from "./iconUtils"
import { Sixtyfour, P, H2, H3, LI, UL, H4 } from "./typography"

export function Rules() {
    return (
        <div className="flex flex-col relative w-full h-full justify-center items-center">
            <div className="absolute inset-0">
                <IconsOverlayFrame />
            </div>
            <div className="relative w-full max-w-3xl rounded-2xl p-8 max-h-[80vh] overflow-y-auto">
                <Sixtyfour className="text-2xl">How to play</Sixtyfour>
                <P>Last updated: February 24, 2026</P>
                <P>
                    Each player controls a brush-like character in a shared falling zone with three lanes: Left | Middle | Right  </P>
                <P>
                    Your goal is to catch falling blossoms while denying them to your opponent.
                </P>

                <H2>Basic Controls</H2>
                <UL>
                    <LI>Move left/right to switch lanes</LI>
                    <LI>Push to shove the opponent sideways</LI>
                    <LI>Activate Perfect Meter abilities when available</LI>
                </UL>

                <P>
                    You cannot pass through the opponent — lane blocking and physical contact are core to the gameplay.
                </P>

                <H2>Rules</H2>

                <H3>1. Match Format</H3>
                <UL>
                    <LI>You can choose the match time</LI>
                    <LI>Divided into two rounds (you either win 2-0 or tie 1-1, might change that)</LI>
                    <LI>No buffs or disadvantages between rounds</LI>
                    <LI>Highest total score after both rounds wins</LI>
                </UL>

                <H3>2. Blossoms</H3>
                
                <P>
                    Blossoms fall continuously across the 3 lanes.
                </P>
                <P>
                    🌸 Normal Blossom
                </P>
                <UL>
                    <LI>Worth 1 point</LI>
                </UL>
                <P>
                    🌸 Middle Lane Blossom
                </P>
                <UL>
                    <LI>Worth 2 point</LI>
                    <LI>Middle lane is the high-value battlefield</LI>
                </UL>
                <P>
                    🌼 Golden Blossom
                </P>
                <UL>
                    <LI>Very rare (only 4 per game)</LI>
                    <LI>Worth 3 point</LI>
                    <LI>Perfect catch bonus: +2 to +3 Perfect Meter points</LI>
                </UL>

                <P>
                    Golden Blossoms create intense scramble moments.
                </P>


                <H3>3. Catching & Perfects</H3>
                <H4>Normal Catch</H4>
                <P>
                    You touch the blossom anywhere in your character’s catch zone → you get its points.
                </P>

                <H4>Perfect Catch</H4>
                <P>
                    You catch the blossom at its exact center timing point → You gain +1 point in the Perfect Meter. Perfect catches are vital for activating abilities.
                </P>

                <H4>Lanes & Lane Control</H4>
                <P>
                    There are 3 lanes you can move between: Left | Middle | Right
                </P>

                <H4>Claiming a Lane</H4>
                <P>
                    Catch 5 blossoms in a row in the same lane to claim it.
                </P>
                <P>
                    When you own a lane:
                </P>
                <UL>
                    <LI>Bonus perfects: Perfect catches in that lane grant +1 extra Perfect Meter point (normal perfect = +1, in your lane = +2)</LI>
                    <LI>Contact advantage: If both players push at the same time in your owned lane, you win the push and the opponent gets knocked back. Lane control creates territorial strategy without overpowering the game.</LI>
                </UL>

                <H4>Perfect Meter</H4>
                <P>
                    The Perfect Meter fills when you catch blossoms perfectly:
                </P>
                <UL>
                    <LI>Normal perfect: +1</LI>
                    <LI>Perfect in a lane you own: +2</LI>
                    <LI>Golden perfect: +2 to +3</LI>
                </UL>
                <P>
                    You can activate special abilities depending on how full your meter is. The meter empties to 0 after using an ability.
                </P>
                
                <H4>Perfect Meter Abilities</H4>
                <P>
                    At 5 Perfects → Reverse Push OR Reverse input. Your opponent’s push turns into a pull for ~1 second OR inputs are reversed, left becomes right and right becomes left. Great for lane steals, repositioning and confusing the opponent.
                </P>
                <P>
                    At 10 Perfects → Ink Freeze. Opponent is unable to move or push for ~0.4 seconds (maybe more). Use it to secure key blossoms or shove them out.
                </P>
                <P>
                    At 15 Perfects → Momentum Surge. Your pushing force is doubled for ~1–2 seconds. This lets you dominate contested lanes, especially the middle.
                </P>
                
                <H4>Contact Mechanics Pushing</H4>
                <P>
                    You may push the opponent sideways to:
                </P>
                <UL>
                    <LI>Block them from lanes</LI>
                    <LI>Knock them off a blossom path</LI>
                    <LI>Contest Middle or Golden blossoms</LI>
                </UL>

                <H4>Simultaneous Push Logic</H4>
                <P>
                    If both players push at the same time:
                </P>
                <UL>
                    <LI>If one owns the lane → they win the push</LI>
                    <LI>If neither owns the lane → no one is pushed</LI>
                    <LI>Middle lane is neutral (unless a player owns it</LI>
                </UL>
                <P>
                    This preserves fairness while rewarding lane control.
                </P>

                <H4>Dynamic Field Event (Might delete)</H4>
                <P>
                    Only one environmental event exists: Wind Gust
                </P>
                <P>
                    1–2 times per round, blossoms briefly drift one lane left or right. This affects both players equally and forces quick lane decisions.
                </P>

                <H3>3. Scoring Summary</H3>
                <UL>
                    <LI>Normal Blossom | 1 point</LI>
                    <LI>Middle Lane Blossom | 2 points</LI>
                    <LI>Golden Blossom | 3 points</LI>
                    <LI>Perfect Catch Bonus | +1 perfect meter</LI>
                    <LI>Lane Perfect Bonus | +1 perfect meter</LI>
                    <LI>Golden Perfect Bonus | +2-3 perfect meter</LI>
                </UL>

                <H2>Winning</H2>
                <P>
                    After the two rounds, total scores are compared. The player with the highest score wins Blossom Clash. 
                </P>
            </div>

        </div>
    )
}