# Hidamari (ひだまり村) — working title

**Game Design Document v0.2** | Approved on 10 November 2026

*Changes in v0.2 (from the Phase 1 test, approved on 10 November 2026): you can pick wild strawberries as gifts (section 6), built panels and hedges block the way but meadow doesn't (section 7.2), the game also saves when a new game starts (section 2), and Gen-san and Midori follow simpler routines in the Phase 1 test (section 5).*

*Changes approved on 12 November 2026 (Milestone 2.3): the typhoon wind comes from the south only (section 7.3), work days start on the same day and last until 17:00 (section 7.2), and crops grow under spaced panels on your home field from the start (sections 5.1 and 7.6).*

*Changes approved on 12 November 2026 (Milestone 2.4 plan): Milestone 2.4 is split into 2.4 and 2.5 (section 18). The water view has a clear rule: rain runs downhill to the south, and a new drainage ditch tile or a pond catches it (sections 7.2 and 7.3). A town meeting approves a plot for good (section 10.1). With Kurokawa's slope partnership, his company holds its own briefing (section 10.3). The citizen fund's money goes into your purse (section 10.2). The three meters have first formulas (section 1).*

*Changes approved on 12 November 2026 (Milestone 2.4): four simplifications of the town meeting and the citizen fund (section 10.5). Fumiko-san's hedge goes along the south side of her field, the side facing her veranda. The Mori family's worry is about safety only. Mr. Oda's nemawashi worry sets how warm the meeting starts. Investors' shares are part of the story and aren't taken from your money.*

*Changes approved on 12 November 2026 (Milestone 2.5 plan):*
- *Festivals take place on the village map, at their own place; the welcome party and the typhoon shelter use the hall (section 11).*
- *Swept panels on snow days make 50% (section 7.5).*
- *Prices for the gifts to the village (section 9).*
- *The Community meter counts festivals and gifts (section 1).*
- *What comes back in the free year (section 12).*
- *The tree sparrow joins the diary as its 32nd species (section 8).*

*Decisions of 12 November 2026 (Phase 3 plan):*
- *Japanese stays standard Japanese with a light flavour for each character (section 19, question 7).*
- *You choose one of four looks for the player: two male, two female (section 5, question 6).*
- *Real facts in the game are collected in a list for checking, `docs/fact-check.md` (section 13, question 11).*
- *A heart event tied to a season can still happen in a later season (section 6).*
- *Phase 3 has three milestones (section 18).*

*Approved on 12 November 2026 (Milestone 3.1, section 6.1):*
- *The support grant is paid after you apply with Ms. Sato in her 4-heart event (sections 5.9 and 10.5).*
- *After Rin's 4-heart event, her student friends count as one more helper on work days (sections 5.8 and 7.6).*
- *The events that open a plot (Gen-san ♥4, Kuma-san ♥4, Ms. Sato ♥2) and Mr. Oda's nemawashi lesson (♥3) happen at the next chat, anywhere, without waiting for earlier events.*
- *Residents hint at a waiting heart event at most every 3 days, and 3 times for each event.*
- *Each household has a second request, on a later day than the first was done, from ♥2 (Gen-san and Midori from ♥1). A request can also ask you to bring things.*
- *Event timings: Mr. Kurokawa's 5-heart event from winter day 3, Midori's 4-heart event is a firefly count at the terraces on a summer evening, Kuma-san's 5-heart event comes after the pond draining.*

*Approved on 12 November 2026 (Milestone 3.2 plan):*
- *The notebook entry about grazing goats is replaced by "Meadows under panels", unlocked by your first meadow tile (the game has no goats) (section 13).*
- *Fact-checking in Milestone 3.2 covers the notebook entries, the energy-policy facts and the four lines flagged in `docs/fact-check.md`. The nature and village-custom facts are checked in Phase 4.*

*Approved on 12 November 2026 (Milestone 3.3 plan):*
- *Furigana come from a reading list (`lang/ja-readings.js`) that the game applies automatically, instead of marks in every line of `lang/ja.js`. A line where a word is read differently gets its own mark. A check makes sure every kanji has a reading (section 15).*
- *Music and sounds start on at a soft level, with two volume sliders and a sound button on the title screen (section 16).*

*v0.1 is the first draft, written in Phase 0. On 10 November 2026 you approved the concept, the residents, the names (as working names) and art style A, and decided: friendships only, a free pixel-style Japanese font, a furigana setting and a free year after the ending. All numbers are first guesses that will be balanced in Phase 2. Rules marked **(proposal)** still need your decision. Everything still open is listed in section 19.*

---

## 0. At a glance

A cozy village life-sim for the browser (computer and phone), in Japanese and English. You move to Hidamari, a small village in the hills. Over one in-game year you make friends, watch the seasons change and, together with the residents, build the village's first **power garden**: solar panels and nature in one place.

- **Audience:** the general public, families and players who have never played a farming game. No background knowledge needed.
- **Length:** one in-game year (4 seasons × 7 days), about 2–3 hours in total, played over several sessions.
- **Feeling:** warm, calm and funny. You can't lose. Every choice changes the story, and every ending is a happy one.
- **Learning:** this comes through the residents' stories, the nature diary and a short village notebook of real facts, never through lectures.
- **What makes it different:** in most village games you grow crops for money. Here, the big project is shared. The village decides together where the sun-power goes, and the way you build changes which animals come, who trusts you and what the next year looks like.

"Hidamari" (陽だまり) means a warm, sunny spot where people like to gather on a cold day.

---

## 1. Premise and goal

**Premise.** You are a young person from the city who has signed up as a **regional revitalisation cooperator** (地域おこし協力隊). This is a real Japanese programme in which people from the city move to a rural area for a few years to help the community. The village of Hidamari, now part of the small town of Komorebi (こもれび町), gives you an old empty house from its **akiya bank** (空き家バンク, a list of empty houses for newcomers) with a small field behind it.

The village has shrinking numbers, overgrown fields, a closed factory by the river and rising electricity bills. Komorebi's town hall has a small budget to "try something with the sun". Your job for one year is to help the village do that *its own way*.

**Goal.** By the New Year, the village has at least one working power garden that its people chose and built together. How big it is, how full of life it is and how many friends you have made decide which ending you reach.

**The three things that grow** (shown as three simple meters in the village notebook):

| Meter | What it measures | Raised by |
|---|---|---|
| ☀ Sun-power | How much clean power the village makes | Panels that are built and working |
| 🐸 Nature | How much life the power gardens and village hold | Nature diary entries, hedges, ponds, meadows, connected corridors |
| ♥ Community | How much the village trusts and enjoys the project | Hearts with residents, the 説明会, the citizen fund, festivals |

The player is never told "you must reach X". The meters only shape the ending (section 12).

**First formulas (Milestone 2.4, to be balanced in Phase 4).** Each meter goes from 0 to 100:
- ☀ Sun-power: the power your working panels make on a sunny day, divided by 3 (a garden you share with Quick Solar Co. counts with your share only).
- 🐸 Nature: the nature points of your power gardens, plus 4 for each diary entry, divided by 1.5.
- ♥ Community: 1.5 for each heart with every resident, plus:
  - 8 for each town meeting that agreed
  - 4 for each citizen fund investor
  - 8 for helping clean up after the mudflow
  - 6 for taking part in the zoning workshop
  - 3 for each festival activity you join (Milestone 2.5)
  - 5 for each gift to the village (Milestone 2.5)

---

## 2. Time

- **One year = 4 seasons × 7 days = 28 days.** Each season is a "week of highlights", not 3 calendar months. The year starts in spring (April, like the Japanese school and fiscal year) and ends in late winter, after New Year.
- **One day lasts about 4–6 real minutes.** You wake at 6:00. The clock runs at about 4 in-game minutes per real second while you walk around, so a full day to midnight takes about 4½ minutes. Going to bed early ends the day sooner.
- **The clock stops** during conversations, in menus, in the nature diary and while planning in build mode. Time only passes while you walk and work. You never feel rushed while reading.
- **Relaxed clock (setting):** the clock runs at half speed, for players who like to wander.
- **Evening chime:** at 17:00 the village loudspeaker plays the evening chime (an original melody). The shop closes, and children go home.
- **Night:** after 20:00 most residents are at home. Some species can only be found at night: fireflies, owls and the raccoon dog.
- **At midnight** you fall asleep wherever you are and wake up at home. There is no penalty.
- **Autosave every evening.** When you go to bed (or at midnight), the game shows a short day summary and saves. If you close the game during the day, you continue from the morning of that day. There is one save slot, plus a backup of the previous evening. The game also saves once when a new game starts, so you can always continue.
- **28 days × ~5 minutes ≈ 2⅓ hours.** Festivals and the 説明会 add some reading time, so 2–3 hours in total.

---

## 3. The daily loop

**Morning (6:00–9:00)**
- The village loudspeaker (村内放送) announces the weather and news, for example "The cherry trees at the shrine are in full bloom" or "Typhoon warning for tomorrow night".
- Check your letterbox: letters from residents, requests, citizen fund dividends, and offers from Quick Solar Co.
- Water and harvest your home field.

**Day (9:00–17:00)**
- Walk around and talk to residents. The first chat each day raises hearts.
- Give gifts, help with requests and take part in community work.
- Plan and build in your power gardens (build mode).
- Watch for animals and plants for the nature diary.
- Buy seeds, hedge seedlings and panel parts at Hiro's shop, and sell vegetables there.

**Evening (17:00–24:00)**
- Residents gather at the shop bench, the community hall or the shrine. This is a good time for longer chats and heart events.
- Watch for night species.
- Go to bed. The day summary shows the power made, money earned, new diary entries and hearts gained, then the game saves.

**What a day usually holds:** 3–5 conversations, one or two tasks (a request, building, farming) and one small discovery. Festival days and the 説明会 are special days with their own scene.

**No stamina bar.** Time is the only limit, so players never have to "manage energy".

**Your home field** is small: about 4 × 4 tiles of vegetables by season, for gifts and a little money. Farming is a side activity, not the core.

| Season | Home field crops (first list) |
|---|---|
| Spring | komatsuna, radish, snap peas |
| Summer | tomato, cucumber, eggplant, edamame |
| Autumn | sweet potato, satoimo (taro), shungiku |
| Winter | daikon, Chinese cabbage (slow, under straw) |

---

## 4. The village map

A small, walkable map: about 80 × 60 tiles of 16 × 16 pixels. You can walk from one end to the other in about one in-game hour. North is at the top.

```
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^~~^^^^
^^^^^^^^^^^^^^^^^^^^^^^^^^*************^^^////////////^^^^^^~~^^^^
^^^^ooooooooo^^^^^^^^^^^^^**[SHRINE]***^^^////////////^^^^^^~~^^^^
^^^^ooo[4]ooo^^^^^^^^^^^^^*************^^^////[6]/////^^^^^^~~^^^^
^^^^ooooooooo^^^^^^^^^^^^^*************^^^////////////^^^^^^~~^^^^
^^^^............................:.........////////////..^^^^~~^^^^
^##############.................:.........////////////..^^^^~~^^^^
.##############.................:.................;........~~.....
.##terraces####.................:..................;......~~......
.##########h###.....h...........|..........h........;....~~.......
.##############.........[SHOP]..|..[HALL]............;...~~.......
................................|.....................;FF~~to town
================================+=================================
................................|........................~~.......
.........h....%%%%%%%%%.........|..[OFFICE]..xxxxxxxxx...~~.......
...[HOME].....%%%[2]%%%.........|..[BUS].....xxxxxxxxx...~~.......
..............%%%%%%%%%.........|............xxx[5]xxx..~~........
..,,,,,,,,....%%%%%%%%%.........|............xxxxxxxxx.~~.........
..,,[1],,,......................|.....h......xxxxxxxxx.~~.........
..,,,,,,,,....""""""""""""""""".|............xxxxxxxxx.~~.........
..,,,,,,,,...."""""""[3]""""""".|......................~~.........
............h.""""""""""""""""".|........h.............~~.........
..............""""""""""""""""".|......................~~.........
................................|......................~~.........
```

| Sign | Place |
|---|---|
| `^` | Forest and mountains (Hidamari-yama, the mountain Fumiko loves to look at) |
| `*` | Cherry trees around the shrine (神社) on the hill. Steps `:` lead down to the village road. |
| `o` | The irrigation pond (ため池), about 300 years old, kept by Kuma-san |
| `#` | Rice terraces (棚田), fed by the pond. Village heritage that stays as it is. |
| `/` | The forest slope, the place Quick Solar Co. wants |
| `;` | A small stream from the slope to the river. `F` marks the firefly spot where it meets the river. |
| `~` | The river, crossed by the road to the town |
| `[SHOP]` | Hiro's general store (なかむら商店) |
| `[HALL]` | The community hall (公民館), also the village's evacuation shelter |
| `[OFFICE]` `[BUS]` | The town hall's branch office (支所) where Ms. Sato works, and the bus stop |
| `[HOME]` `h` | Your house and the residents' houses |
| `%` `"` `,` `x` | Fields, paddies and the old factory site (see the plots below) |

**The six plots for power gardens** (details in section 7):

| | Plot | Size | Owner and permission |
|---|---|---|---|
| [1] | Your home field | 4 × 4 | Yours from day 1 (the tutorial plot) |
| [2] | Fumiko's abandoned field (耕作放棄地) | 8 × 6 | Fumiko, in front of her mountain view |
| [3] | Gen-san's paddy (for agrivoltaics) | 8 × 8 | Gen-san |
| [4] | The irrigation pond (floating panels) | 6 × 6 water | Kuma-san and the irrigation association |
| [5] | The old factory site (a brownfield) | 10 × 8 | The town (Ms. Sato) |
| [6] | The forest slope | 8 × 8 | A landowner in Tokyo, leased by Quick Solar Co. |

**The detailed map** (80 × 60 tiles) was approved on 10 November 2026 and is in `js/map-data.js`. It follows this sketch, with small differences: the post office (where Midori works) and the branch office stand north of the main road, the factory site lies south of it, and the village green south of the centre leaves room for festivals.

---

## 5. The residents

Ten residents (the Mori family counts as one household). All are original characters. Names and details can still change.

| Resident | Who they are | Worry or wish | What they bring as a friend |
|---|---|---|---|
| **Gen-san** (田村 源造, 78) | Old rice farmer | Fields must stay fields | Agrivoltaics partner on his paddy [3] |
| **Fumiko-san** (山本 文子, 82) | Elderly gardener, keeper of village stories | The mountain view | Helps plant hedges, gives hedge seedlings, tells village stories |
| **Aya, Ken and Sora** (森 彩 36, 森 健 38, 森 空 7) | Young family, moved back from Osaka this spring | Costs and children's safety | Invest in the citizen fund, help at the festival. Sora is your diary buddy. |
| **Midori** (青木 みどり, 45) | Runs the village nature group, bird-watcher | Frogs and birds | Species tips, lends binoculars, gives you the nature diary |
| **Mr. Oda** (小田 茂, 68) | Head of the residents' association (自治会) | Consensus: the village must not split | Hosts the 説明会, teaches nemawashi (根回し) |
| **Hiro** (中村 博, 52) | Runs the last shop in the village | Business | Sells seeds and panel parts, invests if he trusts you |
| **Kuma-san** (熊谷 勇, 70) | Keeper of the irrigation pond | Water rights | Allows floating panels on the pond [4] |
| **Rin** (山本 凛, 19) | Student and climate activist, Fumiko's granddaughter | Impatient for solar | Ideas and student volunteers. Clashes with Fumiko. |
| **Ms. Sato** (佐藤 恵, 34) | Town hall branch office | Rules and permits | Explains promotion zones and support schemes, speeds up permits |
| **Mr. Kurokawa** (黒川 隼人, 40) | Sales manager at Quick Solar Co. | Fast money (a quota from his boss) | The friendly rival who tempts you to sell land or build cheaply on the slope. He can become a friend. |

The player character has a name you choose and one of four looks: two male and two female (decided on 12 November 2026). The look only changes the drawing. Game text never needs he or she for the player.

**Routines in the game (since Milestone 2.2):** everyone follows the routines below; the exact hours and places are in `js/game-data.js`. Days 6 and 7 of each season are the weekend, and on the typhoon day everyone stays indoors. Some details the routines needed:
- Gen-san stays by his barn on rainy days, so you can still find him.
- Midori spends her evenings at the rice terraces (frogs), and goes to the nature group meeting at the community hall on day 3.
- Hiro's shop is closed on day 3 of each week; he goes fishing by the river.
- Residents who are indoors at work (Midori at the post office, Mr. Oda and Rin at the community hall, Ms. Sato at the branch office) come to the door when you knock.
- Kotetsu walks with Mr. Oda on his morning round.

All 50 heart events are in the game since Milestone 3.1; how they start is in section 6.1.

### 5.1 Gen-san (源さん), rice farmer

- **Daily routine:** dawn at his paddy checking the water. Mornings in the fields. Noon on his veranda. Afternoons on the bench outside Hiro's shop with tea. On rainy days he repairs tools in his barn.
- **Loves:** dried persimmons (干し柿), rice balls (おにぎり). **Likes:** pickles, green tea, fresh vegetables, a whetstone. **Dislikes:** fancy city snacks, anything from Quick Solar Co.
- **Worry:** "Fields must stay fields." He is the last farmer in his family; his son lives in Nagoya. Who will farm after him?
- **As a friend:** crops under spaced panels on your home field work from the start. At 4♥ he offers his paddy [3] for agrivoltaics. He teaches rice planting and harvest.
- **Requests:** clear the irrigation channel (spring), bring rice seedlings, find his lost sickle, keep the crows away from the seed beds.
- **Heart events:**
  1. ♥1: At dawn in his paddy, he shows you how to read the water level and tells you how his grandfather built the terraces.
  2. ♥2: On a rainy day in his barn, he shows old photos from when 40 families farmed here, and asks, "What will your sun-thing do to the fields?"
  3. ♥3: If crops are growing well under spaced panels on your home field, he crouches down, touches the leaves and agrees to "a small trial".
  4. ♥4: His son calls. Gen admits he's tired. Income from a power garden could pay a young helper, so he proposes the partnership on his paddy.
  5. ♥5: The rice harvest under the panels. He weighs it: "Not bad. Within the village average." He gives you his old straw hat.

### 5.2 Fumiko-san (文子さん), gardener

- **Daily routine:** waters her garden in the morning. Late mornings she sweeps the shrine. Afternoons on her veranda (縁側), facing the mountain. Evenings she cooks for Rin.
- **Loves:** camellia seedlings (椿), sweet bean buns (まんじゅう). **Likes:** seasonal flowers, seed packets, old songs, green tea. **Dislikes:** noise, plastic flowers, anything that blocks the view.
- **Worry:** the mountain view. Every morning for 50 years, she and her late husband watched the sun rise over Hidamari-yama. The abandoned field [2] in front of her house was his.
- **As a friend:** at 2♥ she gives hedge seedlings (native shrubs) and teaches you to plant them. At 3♥ she helps plant hedges. Her village stories unlock notebook entries (結, ひだまり). At 4♥ she opens her field [2], if the panels stay low behind a hedge.
- **Requests:** bring a packet of cosmos seeds, carry compost, find the shrine's lost bell rope.
- **Heart events:**
  1. ♥1: She tells the story of the *hidamari*: the sunny spot under the old zelkova tree where villagers gathered on winter days, and where the village got its name.
  2. ♥2: She shows you her husband's overgrown field. She can't bear to see it like this, but she couldn't bear "a field of glass" either.
  3. ♥3: She teaches you to plant a hedge: "A hedge is a wall that sings." (Birds nest in it.)
  4. ♥4 (with Rin ♥3): Rin and Fumiko argue at dinner. You can help them meet in the middle: a low flowering hedge keeps the view, and the panels sit behind it.
  5. ♥5: At sunrise on her veranda, the hedge is in flower and the panels shine low behind it. She gives her blessing and her husband's garden trowel.

### 5.3 The Mori family (森さん一家): Aya, Ken and Sora

- **Who they are:** Ken grew up in Hidamari. The family moved back from Osaka a month before you arrived, for a calmer life. Aya translates from home. Ken works at a car-parts factory in the town. Sora (7) goes to the small school in Komorebi by school bus.
- **Daily routine:** Aya walks Sora to the bus stop at 7:30 and picks Sora up at 15:00. Ken comes home at 18:00. On weekend days (day 6 and 7 of each season) the family is at the river or the shrine. After school, Sora explores with a magnifying glass.
- **Likes:** Aya: coffee, homemade jam, books. Ken: cold barley tea, tools, baseball talk. Sora: shiny stones, drawings, ramune sweets, *looking at* beetles. **Dislikes:** Aya: wasted money. Ken: being lectured. Sora: green peppers.
- **Worry:** costs (the house loan, electricity bills) and the children's safety: fences, electricity, mud on the school route.
- **As a friend:** at 2♥ Sora joins you as a diary buddy and spots species you would miss. At 3♥ they help at the festival (Aya designs the poster, Ken builds a stall). At 4♥ they invest in the citizen fund.
- **Requests:** find Sora's lost cap, fix the swing at the community hall, bring vegetables for Aya's jam.
- **Heart events:**
  1. ♥1: Sora shows you a frog and asks its name. You look it up together in the diary (diary tutorial, if Midori hasn't done it yet).
  2. ♥2: Aya shows you the electricity bill: "It went up again." You explain what a village power garden could change.
  3. ♥3: Sora wanders towards a power garden. Ken is worried. You build a hedge or fence around it together, and Ken relaxes.
  4. ♥4: Festival preparation. Aya draws a poster with the power garden on it, and Ken builds a sun-powered stall.
  5. ♥5: The family invests in the citizen fund "for Sora's future". Sora gives you a drawing of the village with a big sun.

### 5.4 Midori (みどりさん), nature group

- **Daily routine:** dawn bird-watching at the pond or river. Daytime at the post office counter in the village centre (days 1–5). Evening of day 3 in every season: nature group meeting at the community hall. Weekend days: nature surveys.
- **Loves:** reports of rare species (show her your diary), warm soup. **Likes:** field guides, wild berries, frog-shaped things. **Dislikes:** weed killer, litter, cut trees.
- **Worry:** frogs and birds. She has seen solar parks elsewhere covered in gravel and weed killer, where nothing lives.
- **As a friend:** she gives you the nature diary on day 2. At 2♥ she gives species tips: where and when to look. At 3♥ she lends binoculars (birds can be seen from further away). At 4♥ she holds a nature survey (生きもの調査) in your power garden, which shows its nature score.
- **Requests:** count swallows' nests, put up a nest box, pick up litter by the river.
- **Heart events:**
  1. ♥1: Dawn at the pond. She teaches you to listen for frog calls and to stand still so birds come closer.
  2. ♥2: She shows you a photo of a gravel solar park. "Please don't let that happen in Hidamari."
  3. ♥3: She finds the first frog in your power garden's biotope pond and does a small happy dance.
  4. ♥4: A night firefly count by the stream. If mud from the slope reached it, there are fewer, and she is sad but determined.
  5. ♥5: She proposes your power garden as a candidate nature-coexistence site (自然共生サイト) and asks you to present it at a regional nature meeting.

### 5.5 Mr. Oda (小田さん), head of the residents' association

- **Daily routine:** mornings walking his shiba dog Kotetsu around the village. Midday in the community hall office. Afternoons visiting households. Evenings at home.
- **Loves:** being asked for advice (asking counts as a liked gift once per day), rice crackers (せんべい). **Likes:** shogi puzzles, newspapers, tidy plans. **Dislikes:** surprises, rumours, being bypassed.
- **Worry:** consensus. Twenty years ago, a fight over the closing factory split the village into two camps, and some families still don't talk to each other.
- **As a friend:** at 2♥ he passes your news on the circular board (回覧板). At 3♥ he teaches nemawashi (根回し): talk to everyone *before* a meeting. At 4♥ he hosts the 説明会 warmly and speaks in your favour.
- **Requests:** deliver the circular board, find Kotetsu, set up chairs in the hall.
- **Heart events:**
  1. ♥1: He shows you the circular board and asks you to deliver it. You meet several residents this way.
  2. ♥2: Over tea, he tells you the story of the factory closing and the split in the village.
  3. ♥3: He teaches nemawashi. This unlocks the "worries list" before the 説明会.
  4. ♥4: After a good 説明会: "That's the first time in years everyone laughed at a meeting."
  5. ♥5: At New Year, he asks you to give the first speech of the year at the village gathering.

### 5.6 Hiro (ヒロさん), shopkeeper

- **Daily routine:** opens the shop at 9:00 and closes at the evening chime (17:00). Closed on day 3 of each season. Early mornings he drives his small truck round the village selling to elderly residents who can't get to the shop (移動販売). Evenings he does his accounts.
- **Loves:** new product ideas (for example "sun honey" or rice grown under panels), canned coffee. **Likes:** local specialities, people paying on time. **Dislikes:** haggling, online shopping talk.
- **Worry:** business. His is the last shop in the village, and the electricity bill for his fridges keeps rising.
- **As a friend:** at 2♥ he stocks panel parts (before that, only seeds and seedlings). At 3♥ he puts panels on his shop roof. At 4♥ he invests in the citizen fund, *if he trusts you*: not if you have sold land or a power garden to Quick Solar Co.
- **Requests:** help with a delivery round, find a supplier for paper lanterns, bring 5 cucumbers.
- **Heart events:**
  1. ♥1: He takes you on his delivery round and you meet the oldest villagers.
  2. ♥2: He shows you his fridge electricity bill and agrees to stock panel parts.
  3. ♥3: You design a small rooftop system for the shop together (rooftop solar still gets fixed-price support, a notebook fact).
  4. ♥4: He invests in the citizen fund and suggests selling local products with the power garden logo at the festival.
  5. ♥5: He opens a "Hidamari corner" shelf for produce from under the panels.

### 5.7 Kuma-san (クマさん), keeper of the irrigation pond

- **Daily routine:** at dawn and dusk he checks the pond's water level and sluice gate. Days repairing channels. Late afternoons on the shop bench next to Gen-san.
- **Loves:** grilled sweetfish (鮎の塩焼き). **Likes:** strong tea, good hand tools, help with heavy work. **Dislikes:** careless people near the water, anyone who calls it "just a pond".
- **Worry:** water rights. The pond waters the paddies of 12 families, and the irrigation association decides together. Floating panels might harm the water, the fish or the dam.
- **As a friend:** at 3♥ he explains how floating panels could work. At 4♥ he takes your plan to the irrigation association and speaks for it. Floating panels may cover at most half the water, and the shallow edge must stay natural. At 5♥ he invites the village to the pond draining (かいぼり) in winter.
- **Requests:** clear leaves from the sluice gate, mend the fence, check the water level at dawn.
- **Heart events:**
  1. ♥1: He shows you the sluice gate and explains that the pond is about 300 years old and is shared.
  2. ♥2: Children play too close to the water. You help him mend the fence.
  3. ♥3: At night by the pond, fish are rising and frogs calling. "Floating things take the sun from the water." You talk about covering only part of it.
  4. ♥4: At the irrigation association meeting, he speaks for your plan, if it leaves the edges natural.
  5. ♥5: かいぼり day (winter): the village drains the pond together, removes invasive fish and returns native ones. He gives you a spare key to the sluice hut.

### 5.8 Rin (凛), student and climate activist

- **Who she is:** Fumiko's granddaughter, staying with her for a semester of online classes.
- **Daily routine:** mornings online classes at the community hall (it has the best internet). Afternoons she cycles around the village taking photos and posts about climate. Evenings at the shop buying snacks.
- **Loves:** solar gadgets you build (a solar phone charger), plant-based snacks. **Likes:** books, music, bold ideas. **Dislikes:** "We've always done it this way", "later", plastic waste.
- **Wish:** solar, now and as much as possible. She is impatient enough to consider Kurokawa's offer.
- **As a friend:** at 2♥ she has ideas (a solar charging bench at the bus stop, sun-powered festival lanterns). At 4♥ she brings student volunteers to a work day (from her 4-heart event on, they count as one more helper). She clashes with Fumiko.
- **Requests:** take a photo of the sunrise for her post, find parts for a solar charger, help put up a poster.
- **Heart events:**
  1. ♥1: She shows you a graph of rising summer temperatures on her phone. "Why is everyone so slow?"
  2. ♥2: She is thinking about a summer job with Quick Solar Co. You talk about what "fast" costs.
  3. ♥3 (with Fumiko ♥4): the argument at dinner (see 5.2).
  4. ♥4: She organises a student volunteer day planting hedges, and learns that some things take time to grow.
  5. ♥5: She decides to study regional energy planning and promises to come back every summer.

### 5.9 Ms. Sato (佐藤さん), town hall branch office

- **Daily routine:** at the branch office from 8:30 to 17:15 on days 1–5 of each season. Lunch on the bench outside the community hall. On day 2 of each season she visits sites. Weekend days she is off and sometimes hikes on the mountain.
- **Loves:** a well-prepared plan (an approved build mode plan counts as a liked gift once). **Likes:** coffee, maps, local sweets. **Dislikes:** last-minute paperwork, rule-breaking.
- **Worry:** rules and permits. In another town, she had to deal with a landslide at a solar park that cut corners.
- **As a friend:** at 2♥ she explains the permits and opens the old factory site [5]. At 3♥ she runs the zoning workshop for the promotion zone. At 4♥ she helps with a support scheme grant (you apply together in her 4-heart event).
- **Requests:** bring a signed form from Oda, measure the factory site, find the old site map in the community hall.
- **Heart events:**
  1. ♥1: She explains the permit checklist kindly: "Rules are just promises we wrote down."
  2. ♥2: She tells you about the landslide in the other town, and why she is careful.
  3. ♥3: The zoning workshop (section 10.4).
  4. ♥4: You write a support scheme application together, and it is accepted.
  5. ♥5: She asks to be transferred to the Hidamari branch for good, and invites you to present the village's way at the prefectural office.

### 5.10 Mr. Kurokawa (黒川さん), Quick Solar Co.

- **Daily routine:** from spring day 3, he drives in on days 1, 3 and 5 of each season. He spends time at the bus stop, the shop and the slope, and leaves at dusk.
- **Loves:** a homemade lunch box (お弁当), a quiet place to rest (a hint that he's tired). **Likes:** canned coffee, compliments, quick deals. **Dislikes:** delays, paperwork, being called a villain.
- **Wish:** fast money. His boss wants a quota of megawatts by the end of the year.
- **Role:** the friendly rival. He is charming and never evil. He tempts you: sell or lease him your land, build cheaply on the slope with his kits, or later sell him your power garden. The consequences are shown in section 10.3.
- **Heart events:**
  1. ♥1: He hands you his business card with a joke and shows you his quota sheet.
  2. ♥2: At the slope, he admits his father was a farmer and that the company pushes him hard.
  3. ♥3: After the rainy season, if the slope was built on, he comes to help clean up the mud, ashamed. If it wasn't, he admits he's relieved.
  4. ♥4: He proposes to restore the slope with you: replanting trees and building a small retention pond.
  5. ♥5: At New Year he tells you he has quit Quick Solar Co. and asks whether the village's new power company needs an installer.

---

## 6. Friendship: hearts, gifts and requests

- **Hearts 0–5** per resident (the Mori family shares one heart meter). Each heart is 100 friendship points, so 5 hearts = 500 points. Points never go down by themselves. Only a disliked gift or some story choices take points away.
- **Points (first guesses):**

| Action | Points |
|---|---|
| First chat of the day | +10 |
| Loved gift | +50 |
| Liked gift | +25 |
| Neutral gift | +10 |
| Disliked gift | −20 |
| Request done | +40 |
| Attending a festival together | +10 for everyone there |
| A heart event | +30 |

- **One gift per resident per day** (per household for the Mori family, who share one heart meter; each of them has their own tastes). Each resident has 1–2 loved and 3–4 liked gifts. Residents' words hint at them ("Gen-san keeps looking at the persimmon tree…").
- **Where gifts come from:** things you grow, buy or find. Once a day you can pick wild strawberries (クサイチゴ) at a few bushes: a small gift that costs nothing.
- **Heart events** start when a resident has enough hearts and the place, time and season fit. A small sun icon over their head shows that one is waiting. Events tied to a season have a fallback, so you can't miss them for good: once its season has passed, the event can happen at its usual place and time in a later season (decided on 12 November 2026).
- **Requests** come by letter or on the board outside the community hall: small tasks of 5–20 minutes such as fetching, finding, helping or delivering. They give points, sometimes money, seeds or items.
- **Balance goal:** in one year, a player can reach 5 hearts with about 4 residents and 3 hearts with most others. You can't befriend everyone fully, and that's fine.
- **Friendships only, no romance** (decided on 10 November 2026). Many games in this genre have romance and marriage. Hidamari is a game for everyone about community, so hearts measure friendship.

### 6.1 In the game (since Milestone 3.1)

The rules for the heart events are in `js/events.js`, and their words are in the language files under `ev.…`.

- **Order:** a household's events come in order: the next one waits until the one before has happened. Exceptions:
  - An event that needs something in the game (a garden pond, crops under spaced panels, a nature score of 60) doesn't hold the later ones back while that is missing.
  - The events that open a plot (Gen-san ♥4: his paddy; Kuma-san ♥4: the pond; Ms. Sato ♥2: the factory site) and Mr. Oda's nemawashi lesson (♥3) don't wait. They happen at your next chat, wherever the resident is, so the plots open at the same hearts as before.
- **The sun and hints:** the sun shows when an event can start right there. If it can't happen where you are, the resident sometimes hints at it instead of an everyday line ("On rainy days I'm in my barn"), at most every 3 days and 3 times for each event.
- **Behind a door:** Fumiko-san and Rin's argument at dinner (Fumiko-san ♥4 with Rin ♥3) happens when you knock at Fumiko-san's door between 17:00 and 20:00. It is Rin's 3-heart event too.
- **Elsewhere:** Ms. Sato's 3-heart event is the zoning workshop (section 10.4).
- **What the events change:**
  - Gen-san's ♥4, Kuma-san's ♥4 and Ms. Sato's ♥2 open their plots.
  - Mr. Oda's ♥3 opens the worries list.
  - Hiro's ♥3 puts panels on the shop roof, which you can see.
  - Rin's ♥4 brings her student friends to your work days.
  - Ms. Sato's ♥4 is the grant application.
  - Fumiko-san's ♥3 gives 3 hedge seedlings.
  - Mr. Kurokawa's ♥4 offers to restore the slope after the mudflow (if it never slid, you plant young trees at its edge together).
- **Lines that depend on the year:** Midori's firefly count is sadder after the mudflow, Gen-san's harvest depends on panels on his paddy, Hiro and the Mori family speak of the citizen fund if they invested, and Mr. Kurokawa's ♥3 depends on the mudflow and the clean-up.
- **Timings that needed a choice:**
  - Mr. Kurokawa's 5-heart event can happen from winter day 3 (he only comes on days 1, 3 and 5).
  - Midori's 4-heart event is a firefly count at the terraces on a summer evening.
  - Kuma-san's 5-heart event comes after the pond draining.
  - Mr. Oda's 5-heart event is from New Year's day.
- **Keepsakes:** each household gives one at ♥5. They are kept in the bag with a short description:
  - Gen-san's straw hat
  - Midori's first field notebook
  - Fumiko-san's garden trowel
  - Sora's drawing
  - Mr. Oda's calligraphy
  - The first Hidamari corner sign
  - The spare key to the sluice hut
  - Rin's solar charger
  - Ms. Sato's checklist
  - Mr. Kurokawa's new business card
- **Second requests:** each household (not Mr. Kurokawa) has a second request, chosen from the lists in section 5. It comes on a later day than the first was done, from ♥2 (Gen-san and Midori from ♥1):
  - Gen-san's lost sickle
  - litter by the river (Midori)
  - compost for Fumiko-san
  - the swing behind the hall (Ken)
  - chairs in the hall (Mr. Oda)
  - 5 cucumbers for Hiro (a request to bring things)
  - reading the pond's water gauge at dawn (Kuma-san)
  - parts for Rin's charger (ask Hiro and Ken)
  - the old factory map for Ms. Sato (ask Mr. Oda)

---

## 7. Power gardens

A **power garden** (proposed Japanese name: おひさまの庭, "sun garden") is a plot where panels and nature are planned together. You plan it in build mode, then build it with the residents.

### 7.1 Plots

| Plot | Opens when | Special rules |
|---|---|---|
| [1] Home field 4 × 4 | Day 1 (tutorial on spring day 2) | Yours. No 説明会 needed. Rooftop panels on your house count too. |
| [2] Fumiko's field 8 × 6 | Fumiko ♥4 and a 説明会 | Abandoned farmland needs a farmland conversion permit (2 extra days), unless it becomes agrivoltaics. Fumiko wants the panels low behind a hedge on the road side. |
| [3] Gen-san's paddy 8 × 8 | Gen-san ♥4 and a 説明会 | Agrivoltaics: spaced panels only, and the shade on the crops must stay under 30% (the light view). Yearly harvest check in autumn. |
| [4] Irrigation pond 6 × 6 water | Kuma-san ♥4 and the irrigation association | Floating panels on at most half the water. The outer ring of water stays natural. In summer the panels stay cool and make a little more power. |
| [5] Old factory site 10 × 8 | Ms. Sato ♥2, then clear the rubble (a work day) | A brownfield: no farmland or forest permit, few worries. The best site, but you have to discover it. Becomes a promotion zone in autumn. |
| [6] Forest slope 8 × 8 | Kurokawa's offer (spring) | Cheap and fast, but needs a forest development permit and drainage to be safe. Risky in the rainy season (section 7.4). |

### 7.2 Build mode

- Open build mode on a plot you may use. Time stops while you plan.
- The plot appears as a grid. Pick a tile type from the bar and tap or click to place it, or drag to paint several tiles. Remove a tile the same way. Planned tiles look like pencil sketches until they are built.
- The plan shows its cost, its sun-power, its nature score and, through the four views (section 7.3), what the rules will do.
- **Building:** small plans (up to 8 tiles) you build alone. Each tile takes 15 in-game minutes. Bigger plans need a **work day** (結, yui): friends with ♥2 or more come to help. A work day starts on the same day, must start by noon and lasts until 17:00, however many friends come. It is a small scene with lunch.
- **Changing your mind:** unbuilt plans can always be changed for free. Built tiles can be removed for half their cost back.
- **Walking:** built panels and hedges block the way, so you walk around them. Meadow tiles can be walked on.

**Tile types (first guesses):**

| Tile | Cost | Sun-power per sunny day | Nature points | Notes |
|---|---|---|---|---|
| Dense panels | ¥20,000 | 10 | 0 | Two rows close together. Nothing grows underneath. |
| Spaced panels | ¥24,000 | 7 | 1 | One row on taller posts. Crops or meadow grow underneath. |
| Floating panels | ¥26,000 | 9 | 0 | Pond only. +1 power in summer (the water cools them). |
| Meadow | ¥500 | – | 2 | Wildflowers, mowed twice a year |
| Native hedge | ¥2,000 | – | 3 | Needs seedlings (Fumiko or the shop). Grows to full size in one season. |
| Biotope pond | ¥5,000 | – | 4 | A small pond for frogs and dragonflies |
| Wildlife corridor | ¥1,000 | – | 2 | A strip of long grass, stones or logs that animals can travel along |
| Path | ¥300 | – | 0 | For visitors and maintenance |
| Fence | ¥3,000 | – | 0 | Safety. A hedge on the edge counts as safe too (the Mori family's worry). |
| Drainage ditch | ¥4,000 | – | 0 | Forest slope only (about +20% of a panel's cost). Catches the rain running off the panels north of it (water view). |

**Upkeep:** no weed killer. A meadow is mowed by hand (a short task in summer and autumn), or, once Gen-san knows someone, by two rented goats (ヤギ除草, a real practice and a cute sight).

### 7.3 The Solar Commons rules, made visible: the four views

In build mode, four buttons switch on a **view** that draws its rule on the plot, so players *see* why a design is good, not just a score. These are the same placement rules as in Solar Commons, as simple things to look at.

1. **Wind view: hedges on the edge shelter the park in a typhoon.**
   Arrows show the typhoon wind coming in from the south. A panel is *sheltered* if a hedge stands south of it in the same column, between the panel and the south edge of the plot. Exposed panels glow orange. On typhoon night (autumn day 2), about half of the exposed panels come loose and stop working until you repair them (a task and a small cost). Sheltered panels are always fine. Hedges north of a panel give nature points but don't shelter it. Floating panels on the pond are anchored and never come loose.

2. **Wildlife view: connected wildlife corridors bring animals.**
   Corridor tiles, hedges and meadows that touch each other form a chain. When a chain touches the edge of the plot *and* a pond, hedge or meadow, it lights up with little footprints and counts as connected. Connected corridors bring animals into the garden: the raccoon dog (タヌキ) and the Japanese weasel (イタチ) can only appear in a garden with one. Corridor tiles that aren't connected cost money but bring nothing, and the view shows them grey.

3. **Light view: spaced panels let the crops underneath grow.**
   It shows how much shade falls on the crops. Under dense panels, nothing grows (dark). Under spaced panels, there's dappled light (light), and crops planted there grow. On Gen-san's paddy [3], the share of shade must stay **under 30%** for a good harvest (the real rule for agrivoltaics from April 2027). In the game, dense panels count as full shade and spaced panels as light shade, so in practice the paddy needs spaced panels. The light meter turns green under 30%.

4. **Water view: a forest slope is cheap but risky in the rainy season.**
   On the slope [6], arrows show where rain runs off. Rain runs downhill, to the south (the same way the typhoon wind comes from the south). The rain on each panel runs down its column. A drainage ditch (a new tile, about +20% of a panel's cost) or a pond further south in the same column catches it, and its arrows turn blue. Runoff that nothing catches runs off the plot into the stream and the river: brown arrows. In the rainy season (summer days 1–3), a slope garden without drainage causes a mudflow (section 7.4). On other plots the view shows the water staying put, which also shows why flat sites are safer.

The views use **shapes and icons as well as colour**: arrows, footprints, shading patterns. Players with colour blindness can read them too.

### 7.4 What happens on the slope

- **Why it tempts:** the lease is cheap, there are no fields to protect and no one lives next to it, and Kurokawa's crew builds it in one day.
- **Rainy season:** on summer day 3, a slope garden without drainage sends mud into the stream. The next morning, the stream is brown, the road below is muddy for a day, the firefly count at the festival falls, frogs leave the stream for the rest of the summer, and Kuma-san, Midori and Fumiko lose hearts. The next 説明会 is harder ("We've seen what solar does").
- **Afterwards:** Ms. Sato starts a local solar ordinance (条例): from then on, forest slopes are closed for new gardens, and all 説明会 need the 自治会's clear agreement. You can help clean up (a work day, hearts back) and, with Kurokawa ♥4, restore the slope by replanting trees and building a retention pond, which brings the frogs and fireflies back the next year (shown in the ending).
- **With drainage:** the risk is small (a 10% chance of a small, harmless runoff that teaches the point without harm).
- **Not game over:** the slope teaches the lesson, but the story always continues.

### 7.5 Sun-power and money from gardens

- Each panel tile makes power every day: sunny 100%, cloudy 50%, rain 20%, snow 10% (until you sweep the panels). Loose or unrepaired panels make nothing.
- **Sweeping snow** (approved for Milestone 2.5): on a snow day, a "Sweep snow" button in build mode clears a plot's panels, 5 minutes per panel and free. Swept panels make 50% that day, like on a cloudy day.
- The power is used first by the community hall, the shop and the households that joined, then sold. In the game, power is simply turned into money each evening (first guess: ¥150 per power point).
- **Balance goal:** a well-built garden pays back its cost in about two seasons, so building early in spring pays off, but a summer garden still earns back most of its cost by New Year.

### 7.6 In the game (since Milestone 2.3)

The plots, build mode and gardens follow sections 7.1–7.5. The exact numbers are in `js/game-data.js`. Some details the game needed:

- **The shared home field:** from the start, you can grow vegetables on your home field, on open soil or under spaced panels (nothing grows under dense panels). Hiro sells the seeds for the season: komatsuna (spring and autumn, 3 days), cucumber and tomato (summer, 3 and 4 days), sweet potato (autumn, 4 days) and daikon (winter, 4 days). You can give the vegetables as gifts or sell them to Hiro.
- **Opening plots:** the owner tells you the next time you talk, once you have enough hearts (section 7.1). Then the village meets before anything is built (section 10.5). The forest slope [6] opens only through Kurokawa's partnership (section 10.5).
- **Panel parts:** a starter kit has parts for 4 panels. After that, Hiro orders parts once he has ♥2 with you.
- **Each plot has its own tiles:** Gen-san's paddy only spaced panels, hedges and corridors. The pond only floating panels, never on its outer ring and on at most half the water.
- **Shade (light view):** a dense panel counts as full shade and a spaced panel as half shade, shared over the whole plot. Build mode warns when the paddy reaches 30%. On autumn day 3, a paddy with panels and less than 30% shade has a good harvest (Gen-san is happy and sends rice balls). With more shade the harvest is poor.
- **Work days (結):** plans of more than 8 tiles need at least one friend with ♥2. A work day must start by noon and lasts until 17:00. Each helper gains a little friendship. Clearing the factory rubble is a work day with at least 2 friends. After Rin's 4-heart event, her student friends come too and count as one more helper (approved on 12 November 2026).
- **The typhoon (autumn day 2):** every other exposed panel comes loose. Repairing costs ¥2,000 and 15 minutes per panel, in build mode. Floating panels are anchored and never come loose.
- **Nature score:** build mode shows each plot's nature points (Midori's survey scene comes later).
- **Small screens:** build mode zooms out in whole steps when a plot doesn't fit above the build bar.

---

## 8. The nature diary (いきもの日記)

- Midori gives you the diary on spring day 2. It is a sketchbook: each species you **watch closely** is drawn into it with a short note.
- **No catching.** When a species is near, a small "!" appears. Press the action button and stand still for 2 seconds while the sketch is drawn. Birds fly off if you run. Some species only appear at night, in the rain or in a certain season.
- **Species appear by habitat:**

| Habitat | Examples | Needs |
|---|---|---|
| Meadows | Butterflies (cabbage white, pale grass blue, small copper, yellow swallowtail), honeybees, grasshoppers, bell crickets in autumn | Meadow tiles or wild meadows. More meadow brings more species. |
| Ponds and paddies | Frogs (Japanese tree frog, Japanese brown frog, Schlegel's green tree frog), dragonflies (common skimmer, red dragonfly in autumn), water striders, Japanese rice fish (メダカ), the rare diving beetle (ゲンゴロウ) | A biotope pond or a paddy without weed killer. Natural edges help. |
| Hedges and trees | Birds: Japanese tit, warbling white-eye, bush warbler (spring song), bull-headed shrike (autumn), Daurian redstart (winter) | Hedges (4 or more tiles bring birds into a garden) |
| Rivers and streams | Grey heron, kingfisher (rare), **Genji fireflies (summer nights)** | Clean water. Mud from the slope drives them away. |
| Corridors and forest edge | Raccoon dog, Japanese weasel, Japanese hare (tracks in snow), Japanese squirrel, rhinoceros beetle (summer nights), cicadas | A connected corridor to the forest or the river |
| Village | Barn swallows (nests under the shop roof in spring), green pheasant, tree sparrow | Always there in the right season |

- **32 species** in total (the list for Milestone 2.5 is in `js/game-data.js`). One playthrough can find about 20–25, so the diary also gives a reason to play again.
- Each entry has: a pixel sketch, the name (Japanese and English), where and when you saw it, and one short fact ("Fireflies need clean water: their larvae eat a small water snail called kawanina").
- **Garden nature score:** like biodiversity in Solar Commons. Nature points from the tiles, plus a bonus for variety (each different nature tile type, and spaced panels, count once). Midori's nature survey shows it. Some species only appear in gardens above a score (for example the kingfisher needs a pond garden with score 30 or more).
- **Seasons in the diary:** spring = butterflies, frogs, swallows. Summer = fireflies, dragonflies, beetles, cicadas. Autumn = red dragonflies, crickets, shrikes. Winter = tracks, winter birds, the かいぼり pond draining.
- Species facts will be checked in Phase 3 (section 13).

### 8.1 In the game (since Milestone 2.5)

All 32 species are in the diary. Their seasons, hours and places are in `js/game-data.js`, and each card shows a hint about where and when to look. Some details the game needed:

- **Places:** meadows, your meadow tiles, hedges, the water's edge, the paddies, the irrigation pond, calm water, the paddies' water, your garden ponds, the river and stream banks, the clean stream, your connected wildlife corridors, the forest edge, and the village around the houses.
- **Garden rules:**
  - Birds come to hedges in a garden only if it has 4 or more hedge tiles.
  - Honeybees need 3 or more meadow tiles in your gardens.
  - The raccoon dog and the weasel appear only on connected corridors.
  - The diving beetle (garden score 25) and the kingfisher (garden score 30) live in garden ponds, and they seldom show themselves.
- **Mud:** after the mudflow, frogs and dragonflies leave the stream until the clean-up or the end of summer, and only one firefly shows at a time.
- **Hare tracks** appear on the snow at the forest edge from winter day 2.
- **Midori's nature survey:** from 4 hearts, she offers to survey one of your gardens, each garden once a season. She tells you its nature score, what she thinks of it and one tip, and she gains 20 friendship points. A score of 60 or more makes the garden a candidate nature-coexistence site.

---

## 9. Money

- **Currency:** yen (¥). You start with ¥30,000 (first guess).
- **Income:**
  - Electricity from power gardens (each evening)
  - Selling vegetables and crops at Hiro's shop
  - Rewards for some requests
  - Your cooperator allowance: ¥40,000 at the start of each season (first guess)
  - The citizen fund (section 10.2), money that friends invest for a garden
  - Support scheme grants (Ms. Sato ♥4, promotion zone)
- **Spending:** panel parts, seeds and hedge seedlings, tools, gifts, repairs after the typhoon, and **gifts to the village**.
- **Gifts to the village (寄付):** at the community hall you can give money to village causes: new paper lanterns for the festival, the shrine roof, solar lights on the school route, a battery for the community hall (so it stays lit in a blackout). Each gift raises hearts with everyone a little, and some change the village scenery.
  - Prices (first guesses, approved for Milestone 2.5): paper lanterns ¥20,000, the shrine roof ¥50,000, solar lights on the school route ¥30,000, a battery for the hall ¥60,000.
  - Each gift gives +15 friendship points with every household.
- **Sell to Quick Solar Co.:** Kurokawa offers good money for land or a finished garden. It's never forced, and its consequences are shown in section 10.3.
- **No debt, no bankruptcy.** If money runs low, requests, vegetables and the allowance always get you going again. Money should never block the story for long.

---

## 10. Community moments

### 10.1 The town meeting (住民説明会)

Before a power garden on plots [2] to [6] is built, the village meets in the community hall. This is the game's big dialogue scene.

- **Before the meeting:** with Mr. Oda ♥3 you learn nemawashi, and a **worries list** shows each resident's worry and whether your current plan answers it:

| Resident | The plan answers the worry if… |
|---|---|
| Gen-san | Farmland stays farmed (agrivoltaics or crops under spaced panels) |
| Fumiko | A hedge on the road-side edge, panels low, not the forest slope |
| Mori family | A hedge or fence on all edges, and a citizen fund or village benefit |
| Midori | A garden nature score of 20 or more, no weed killer |
| Kuma-san | Nothing changes the water (or, for the pond, the half-water rule) |
| Hiro | Some of the power or money stays in the village |
| Mr. Oda | Everyone was talked to before the meeting (nemawashi) |

- **The scene:** residents sit in the hall, drawn on the canvas. Their words appear as page text. Mr. Oda opens. You present your plan (choose what you lead with: the village, nature or money). Then residents whose worries aren't answered stand up and ask. For each question you choose from 3 answers:
  - **Honest and concrete:** works well if the plan really has the answer ("There'll be a hedge of camellias along the road").
  - **"You're right, I'll change the plan":** adds a condition. The meeting goes on warmly.
  - **Vague or dismissive:** the room cools.
- **The room's warmth** (a small sun that grows or shrinks) rises with good answers and with friends: residents with ♥3 or more speak up for you, for example Gen-san saying "I've seen the crops under those panels myself."
- **Outcomes:**
  - *Everyone agrees*: build when you're ready.
  - *Agreed with conditions*: build after you change the plan as promised (the worries list shows what's left).
  - *"Let's meet again"*: talk to people and try again from the next day. There's no limit and no penalty except time.
- **A meeting approves a plot for good.** Later changes to the same plot don't need another meeting, as long as you keep the conditions you promised.
- **Kurokawa** may sit in the back row and make a slick offer during the meeting, a moment for the player to answer.

### 10.2 The citizen fund (市民ファンド)

- After a successful 説明会, Hiro (♥2) suggests a citizen fund, and Ms. Sato helps with the paperwork. You open it for one garden for 3 days.
- **Who invests:** residents with ♥3 or more, more with more hearts (first guess: ♥3 ¥10,000, ♥4 ¥25,000, ♥5 ¥50,000). The Mori family invests from ♥4, and Hiro only if he trusts you. Trust falls if you sold land or a garden to Quick Solar Co., or if your slope garden caused the mudflow.
- **What they get:** a share of that garden's income, paid by letter each season ("My sun share bought Sora new shoes!"). Investors talk about "our garden" and look after it.
- **Effect:** money for building, ♥ for investors, and the Community meter rises. It's the key to the "Everyone's power" ending.
- **The money goes into your purse.** It isn't locked to the garden the fund was opened for.

### 10.3 The rival: Quick Solar Co. (クイックソーラー株式会社)

- **Spring day 3:** Mr. Kurokawa arrives in a shiny car. He offers you two deals:
  - **(a) Lease him your home field** for a big sum now. You lose plot [1] for the year.
  - **(b) Partner on the forest slope:** his cheap kit and crew, your local face. The garden is built in one day, with dense panels and no drainage, and you get a share of the money. His company holds its own short briefing in town, so the slope needs no 説明会 from you. That is part of the temptation.
- **If you accept (b):** you earn money from spring, but the slope consequence in the rainy season falls on *you* (section 7.4). Residents lose more hearts, Hiro won't invest, and the 説明会 is harder.
- **If you decline:** Kurokawa builds a smaller slope park himself. The mudflow still happens, but the village doesn't blame you, and helping to clean up earns hearts.
- **Preventing it:** if Mr. Oda is at ♥3 before the summer, you can ask him to write to the slope's owner in Tokyo. The owner refuses Kurokawa's lease, the slope stays forest, and Ms. Sato tells the story of the other town instead. Kurokawa grumbles and keeps visiting.
- **Autumn:** Kurokawa offers to buy your finished power garden for 1.5 times its cost. If you sell, Quick Solar Co. cuts the hedges and sprays weed killer, species leave, and investors are hurt. It's never forced.
- **His arc:** Kurokawa is a person under pressure, not a villain. Befriending him (section 5.10) leads to him helping restore the slope and, in the best case, joining the village.

### 10.4 The promotion zone (促進区域) with Ms. Sato

- **Autumn day 1, the zoning workshop:** Ms. Sato (♥3) invites everyone to the community hall. A big map of the village lies on the table. Residents place green (welcome), yellow (careful) and red (no) stickers on the plots. You can talk with them as they decide. Their choices depend on their worries and on what has happened, so after a mudflow the slope always gets red.
- **Result:** a promotion zone map, usually the factory site and parts of the paddies in green and the slope in red. Gardens in the zone get faster permits (no extra permit days), a small support grant (after Ms. Sato's 4-heart event) and a warmer start at the 説明会.
- **Support schemes:** Ms. Sato explains in plain words why it matters: new ground-mounted solar parks no longer get fixed-price support from fiscal year 2027, but certified projects in promotion zones may keep it (a proposal being decided around January 2027; see section 13).

### 10.5 In the game (since Milestone 2.4)

Sections 10.1–10.4 and 7.3–7.4 work as described. The exact numbers are in `js/game-data.js` and the rules in `js/community.js`. These are the details the game needed. Four of them simplify a rule above (approved on 12 November 2026, marked *approved simplification*).

**Plans and the worries list**
- On a plot that needs a town meeting, the plan you draw is kept as a pencil sketch when you close build mode (the button says "Keep plan"). The meeting talks about that plan.
- After Mr. Oda's lesson (♥3), build mode has a **Worries** button. It lists each resident whose worry counts on this plot, with ○ (the plan answers it) or ×, as words as well as shapes. After the meeting, it shows your promises.
- What answers each worry:
  - Gen-san (Fumiko's field and his paddy): no dense panels.
  - Fumiko-san (her field): *(approved simplification)* a hedge all along the south side, the side facing her veranda (paths are allowed as gaps), instead of "the road side".
  - The Mori family (Fumiko's field, the paddy, the pond and the factory): hedges, fences or paths all round. The factory has its old fence and the pond's panels float out on the water, so those count as safe. *(Approved simplification)* The second half, "a citizen fund or village benefit", is left out here; Hiro's worry covers money.
  - Midori (Fumiko's field, the paddy, the pond and the factory): a nature score of 20 or more. On the pond, the wild outer ring counts.
  - Kuma-san (the paddy and the pond): the plot's own water rules already answer it, so he asks only if you skipped nemawashi, and then an honest answer warms the room.
  - Hiro (Fumiko's field, the paddy, the pond and the factory): no deal with Quick Solar Co. (no lease, partnership or sale).
- **Nemawashi:** once Mr. Oda has taught it, residents with a worry hear about a waiting plan when you talk to them, and say whether it answers their worry. *(Approved simplification)* Mr. Oda's own worry isn't a question: if you told everyone, the meeting starts one step warmer, and if you didn't, one step colder.

**The town meeting**
- Ask Mr. Oda (when you talk to him) or use the notice board. The meeting is the next evening at 19:00 and starts on its own wherever you are. If you go to bed earlier, you are asked whether to go to the meeting first. A missed meeting moves to the next day.
- **The room's warmth** (0–6, a sun on the wall and a line under the top bar) starts at 1:
  - +1 if you told everyone (nemawashi), −1 if you learned nemawashi but skipped someone.
  - +1 in the promotion zone.
  - −1 after the mudflow, and −1 more if it came from your garden.
- **What you lead with:**
  - The village: +1 if you told everyone, otherwise 0.
  - Nature: +1 if Midori's worry is answered, otherwise −1.
  - Money: +1 if the plan makes 50 or more power, otherwise 0.
- **Questions:** only residents whose worry counts on this plot ask, and those who already heard that the plan answers it stay quiet. Each answer changes the warmth:
  - An honest answer: +1 if the plan has the answer, −1 if not.
  - "You're right, I'll change the plan": 0, and it becomes a promise. For Kuma-san and Hiro, whose worries a plan change can't fix, it's a promise in words.
  - A vague answer: −2.
- **Support:** after a good answer, one friend with ♥3 or more (Mr. Oda at ♥4) speaks up: +1, once each. Nobody speaks up just before their own question.
- **Mr. Kurokawa** speaks from the back row once, in the first meeting after you met him (not if you are his partner): +1 or −1.
- **The result:** the meeting agrees at 2 or more (3 after the ordinance). Promises are checked when you build, and the worries list shows them. Mr. Oda gains 20 friendship points.
- **Farmland permit:** on Fumiko's field, dense panels wait 2 days after the meeting. Spaced panels never wait, and nothing waits in the promotion zone.

**The citizen fund**
- At the end of a meeting that agreed, Hiro (♥2, if he trusts you) suggests a fund, and Ms. Sato helps.
- It's open for 3 days. Each evening, friends who trust you invest by their hearts: ♥3 ¥10,000, ♥4 ¥25,000, ♥5 ¥50,000. The Mori family invests from ♥4, Ms. Sato and Mr. Kurokawa don't invest, and Hiro doesn't after a deal with Quick Solar Co. or your mudflow. Each investor gains 20 friendship points.
- At the start of each season, the investors send a letter. *(Approved simplification)* Their share of the income is part of the story only: it isn't taken from your money.

**Mr. Kurokawa and the forest slope**
- On spring day 3 a Quick Solar Co. flyer is in your letterbox. When you first talk to him, he makes both offers; "Let me think about it" means he asks again on another day, until summer.
  - **The lease:** ¥80,000, and your built tiles come back at half their cost. Your field fills with his dense panels until the end of the year (no vegetables, no power for you), and Gen-san loses 30 points.
  - **The partnership:** his crew builds 24 dense panels overnight, with no drainage. You get 30% of their power, and you can add drainage ditches, ponds, hedges and meadow in build mode.
  - **No:** he builds his own park of 16 panels on summer day 1, unless Mr. Oda (♥3) wrote to the owner before then.
- **Summer day 3 (the evening):** if any panel's runoff is not caught, mud reaches the stream. The stream stays brown until the clean-up or the end of summer, and the ordinance follows (no new panels on the slope, meetings need 3). If the garden was yours, Kuma-san, Midori and Fumiko-san lose 60 points each. With drainage there is a 10% chance of a small, harmless runoff.
- **The clean-up** is a work day at the slope's sign (at least one friend with ♥2, starting by noon). Kuma-san, Midori and Fumiko-san gain 40 points each, and Mr. Kurokawa helps if he has ♥2.
- **Restoring the slope:** with Mr. Kurokawa at ♥4, you can restore it after the mudflow. Young trees, a meadow strip and a retention pond replace the panels.
- **His autumn offer** (from autumn day 1, once) is for your biggest garden at 1.5 times its cost. If you sell, the hedges and meadows go, and Midori and every investor lose 50 points.

**The promotion zone workshop**
- It's on autumn day 1 at 10:00, if Ms. Sato has ♥3 (her letter arrives the day before).
- The factory gets green and the slope red. Fumiko's field, the paddy and the pond get green if their owner has ♥4, otherwise yellow.
- You can speak for one yellow place, which turns it green.
- After you apply with Ms. Sato in her 4-heart event, the first panels you build in the zone bring a ¥30,000 grant, once (approved on 12 November 2026; before Milestone 3.1, ♥4 was enough).

**The meters and the ending**
- The village notebook in the menu shows the three meters (formulas in section 1).
- On the last evening, the village gathers in the hall. Then the ending is chosen:
  - All three meters at 60 or more: "A village in the sun".
  - The highest meter under 35: "A small first step".
  - Otherwise, the highest meter decides (on a tie: nature, then community, then sun-power).
- Each resident you met has a closing line by hearts (♥4–5, ♥2–3, ♥0–1), and the slope has one: forest, restored, scar, or a park whose drains held. These texts are placeholders until Phase 3.

**Comes later:** the full nature diary, the festivals and the free year (Milestone 2.5), and the heart events and full story texts (Phase 3).

---

## 11. Seasons and events

The days of each season, with fixed events. Other days are free.

| Day | Spring (春) | Summer (夏) | Autumn (秋) | Winter (冬) |
|---|---|---|---|---|
| 1 | You arrive. Meet Mr. Oda and Fumiko. | Rainy season (梅雨) begins: frogs, hydrangeas | Zoning workshop (promotion zone) | Winter solstice (冬至): yuzu bath |
| 2 | Home field tutorial. Midori gives you the diary. | Rainy season | **Typhoon** at night. Next morning: check damage, community hall as shelter. | Snow. Sweep the panels. |
| 3 | Mr. Kurokawa arrives | Rainy season ends. **Slope consequence** (if built). | Rice harvest with Gen-san (agrivoltaics harvest check) | Quiet day: residents talk about the year |
| 4 | **Cherry-blossom picnic (お花見)** at the shrine | **Summer festival and fireflies (ほたる祭り)** by the river at night | Red dragonflies. Persimmons ripen. | **New Year's Eve and first shrine visit (初詣)** at midnight |
| 5 | Spring planting in your home field | Hot day: cicadas, watering | Citizen fund letters arrive | **New Year (お正月):** first sunrise (初日の出) over the power garden |
| 6 | Rice planting (田植え) with Gen-san and the village | Hot day | **Harvest festival (秋祭り)** at the shrine | かいぼり (pond draining) with Kuma-san |
| 7 | Welcome party for you and the Mori family at the community hall | Evening by the river | Autumn leaves on the mountain | **Year's-end gathering:** plum blossoms, the ending |

- **Weather:** spring mostly sunny, summer rainy (days 1–3) then hot and sunny, autumn mixed with one typhoon, winter cold with snow on 2 days.
- **The typhoon** cuts power to the whole village at night. If a power garden has a battery (a gift to the village), the community hall stays lit as the evacuation shelter and neighbours gather there: a warm scene in the middle of the storm.
- **Festivals** are special scenes with all residents present. You can talk to everyone, take part in one small activity (a lantern game, a dance, picnic food) and see your project reflected (Aya's poster, Rin's sun lanterns, the power garden's lights).
- **Where festivals happen** (approved for Milestone 2.5): on the village map, at their own place (the shrine, the river, Gen-san's paddy, the pond), for a few hours. Everyone gathers there. You join by walking over, talking to people and doing the small activity, which gives +10 friendship with everyone there (section 6). The welcome party and the typhoon shelter night take place in the community hall room.

### 11.1 In the game (since Milestone 2.5)

The morning announcement names the festival and its hours. A hint appears when it begins. Everyone there has a line about it, and the host offers the activity once per year.

| Day | Festival | Where, when | Host and activity |
|---|---|---|---|
| Spring 4 | Cherry-blossom picnic | Shrine, 11:00–15:00 | Mr. Oda: share something from your bag (or Fumiko-san shares her rice balls) |
| Spring 6 | Rice planting | Gen-san's paddies, 9:00–12:00 | Gen-san: plant slowly in straight rows, or fast (1 hour) |
| Spring 7 | Welcome party | Community hall, 18:00 | A scene: your toast |
| Summer 4 | Firefly evening | The stream, 19:00–22:00 | Midori: count the fireflies (40, or 12 after the mudflow, 25 after the clean-up); the firefly goes into your diary |
| Autumn 2 | Typhoon shelter night | Community hall, 19:00 | A scene: lit by the battery (with the gift and a garden with panels) or by candles |
| Autumn 6 | Harvest festival | Shrine, 15:00–20:00 | Mr. Oda: the lantern game, with a small prize |
| Winter 4 | New Year's Eve, first shrine visit | Shrine, 22:00–24:00 | Fumiko-san: ring the bell and draw a fortune |
| Winter 6 | Pond draining (かいぼり) | Irrigation pond, 9:00–13:00 | Kuma-san: sort the fish (2 hours, Kuma-san +30) |

- **Small moments:** a yuzu bath when you go to bed on the winter solstice (winter day 1), and the first sunrise of the year after the announcement on New Year's day (winter day 5).
- **Going to bed early:** on the evening of the welcome party or the shelter night, you are asked whether to go to the hall first.
- **Gifts to the village** are made at a donation box on the community hall wall, with the prices in section 9:
  - The paper lanterns hang at every festival except the firefly evening (fireflies need the dark), and glow at night.
  - The school-route lights stand by the bus stop and glow at night.
  - The battery lights the shelter.
  - The shrine roof changes nothing you can see yet.
- **Snow:** on snow days, unswept panels show snow on top, and the evening summary reminds you to sweep them.
- **The free year:** after the ending, "Play the free year" starts year 2 on spring day 1, with the season's allowance. The top bar shows the year, and the ending you reached is kept. At the end of year 2, Mr. Oda says goodbye, and you can go back to the title or start a new game. Festivals can be joined again each year.
- **Festival lines** were reviewed in Milestone 3.2: two that contradicted the heart events were changed. In the free year, everyone has a festival line of their own, and 14 everyday morning news have a second-year version (the weather and festival news stay the same).

---

## 12. Endings

Every ending is positive. There is no game over. On the last day, the village gathers, the year is remembered through your diary and photos, and residents say what changed.

| Ending | When | What happens |
|---|---|---|
| **A village in the sun** (ひだまりの村) | All three meters high | The village becomes a small "sun village". The community hall, shop and school route run on village power, and the residents ask you to stay for good. |
| **The firefly garden** (ほたるの庭) | Nature highest | Your garden becomes a candidate nature-coexistence site, school classes visit, and Midori's diary fills. |
| **Everyone's power** (みんなの電気) | Community highest | A big citizen fund. The village founds its own small power company, and Hiro sells "Hidamari power" at the shop. |
| **The lights of Hidamari** (あかりの村) | Sun-power highest | Many gardens. The community hall, shop and festival run on sun-power, and Rin's lanterns line the river. |
| **A small first step** (小さな一歩) | All meters modest | One small garden and a few good friends. "Next year we'll do more, together." Warm and hopeful. |

- **Epilogues** follow for each resident, depending on hearts: for example Gen-san's second harvest under the panels, Fumiko's hedge in flower, Kurokawa's new job.
- **The slope** shows up in every ending: as forest, as a restored hillside, or as a scar the village is still healing. All three are told kindly.
- **After the ending: a free year** (decided on 10 November 2026). After the credits, you can play one more year of 28 days without new story. The seasons, festivals and residents' routines go on, and the power gardens keep running. You can finish the diary, your friendships and your power gardens, and heart events you missed can still happen. The ending you reached stays saved. At the end of the free year, the village says a short goodbye, and you can start a new game.
- **What comes back in the free year** (approved for Milestone 2.5):
  - Kurokawa's offers, the mudflow, the zoning workshop and the ending don't happen again.
  - The typhoon, the rice harvest and the festivals come back.
  - Heart events you missed can still happen, and plots that still need a town meeting can still hold one.
  - The top bar shows the year.

### 12.1 In the game (since Milestone 3.2)

- **The ending scene:** after Mr. Oda's welcome, he gives the year in numbers: species in your diary, the sun-power your gardens made, and the festivals you joined. Then every friend with ♥3 or more stands up and says one line. Some lines depend on what happened: Gen-san's paddy under panels, Midori's nature-coexistence site, Hiro's roof, Mr. Kurokawa as an installer. Then comes the ending, now four lines long.
- **Epilogues:** after a resident's 5-heart event, their epilogue tells what came of it (for example Rin studying energy planning, Ms. Sato moving to the Hidamari branch). Otherwise it depends on hearts, as before.

---

## 13. The village notebook (村のノート)

A short notebook of real facts: one or two sentences each, unlocked by situations in the game (for example the farmland entry when you first plan on Fumiko's field). It can always be read from the title screen. Texts will go into the language files, and sources will be recorded in a separate `docs/village-notebook.md`, as in Solar Commons.

| Entry | Unlocks when | Status |
|---|---|---|
| Regional revitalisation cooperators (地域おこし協力隊) | Start | New: to research |
| Akiya banks (空き家バンク) | Start | New: to research |
| Yui (結): villagers helping each other | First work day | New: to research |
| Nemawashi and the residents' association (根回し・自治会) | Oda ♥3 | New: to research |
| The resident briefing (説明会), required since April 2024 | First 説明会 | Reviewed in Solar Commons |
| Farmland conversion (農地転用) | Planning on Fumiko's field | Reviewed in Solar Commons |
| Agrivoltaics (営農型), shading under 30% from April 2027 | Planning on Gen-san's paddy | Reviewed in Solar Commons |
| Forest development permit (林地開発許可), from 0.5 ha since April 2023 | Kurokawa's slope offer | Reviewed in Solar Commons |
| Local solar ordinances (条例) | The ordinance after the mudflow (or Ms. Sato's story) | Reviewed in Solar Commons |
| Promotion zones (促進区域) | Zoning workshop | Reviewed in Solar Commons |
| The end of FIT/FIP for new ground-mounted solar from fiscal year 2027 (rooftops keep support) | Hiro's rooftop event or the zoning workshop | Reviewed in Solar Commons |
| Citizen funds (市民出資) | Opening the citizen fund | Reviewed in Solar Commons |
| Nature-coexistence sites and 30by30 (自然共生サイト) | Midori ♥5 or garden nature score 60 | Reviewed in Solar Commons |
| Decommissioning reserve (廃棄等費用積立) | First garden runs | Reviewed in Solar Commons |
| Irrigation ponds (ため池) and floating solar | Kuma-san ♥3 | New: to research |
| Rice paddies as wetlands (メダカ, frogs) | First paddy species | New: to research |
| Fireflies need clean streams | Summer festival | New: to research |
| Hedges and windbreaks (生垣・屋敷林) | Typhoon | New: to research |
| Solar, batteries and evacuation shelters | Typhoon night | New: to research |
| Meadows under panels (パネルの下の草地) | Your first meadow tile (replaces the goats entry, approved on 12 November 2026) | New: to research |

**"Reviewed in Solar Commons"** means the text was researched and approved there (see Solar Commons `docs/policy-notebook.md`) and will be shortened for this game. Facts that change (FIT/FIP exceptions, promotion zones) must be checked again before release. The new entries will be researched and given to you for review in Phase 3.

### 13.1 In the game (since Milestone 3.2)

- All 20 notes are in the game. Their texts, sources and the checks behind them are in `docs/village-notebook.md`, reviewed and approved on 12 November 2026.
- A note unlocks at its moment in the table above, and a short message at the bottom of the screen says so. The notebook (in the menu) shows the three meters and then the notes, with "New" on notes you haven't read yet.
- Notes you have found are also kept in the browser apart from the saved game. Once you have found one, the title screen shows a "Village notebook" button with every note you found in any game.
- The fact check found five game lines that were not accurate (the temporary permit for agrivoltaics, who supports batteries at shelters, who certifies nature-coexistence sites, amazake, the Daurian redstart). Only their words changed, not the rules.

---

## 14. Controls

**Computer (keyboard, mouse optional)**

| Key | Action |
|---|---|
| Arrow keys or W A S D | Walk |
| Shift (hold) | Walk faster |
| Space, Enter or E | Talk, look closely, use, confirm |
| Esc | Back, close, pause menu |
| B | Build mode (when standing on a plot) |
| N | Nature diary |
| I or Tab | Bag |
| 1–9 | Choose the item or tile in the bar |
| Mouse click | Walk to a place, or use the build mode grid |

**Phone and tablet (touch)**

- **Tap to walk:** tap the ground and you walk there (around obstacles). Tap a person or thing to walk to it and face it.
- **Action button** (bottom right, large): talk, look closely, use. The same button confirms in conversations.
- **Menu button** (top right): bag, diary, notebook, settings, save and quit.
- **Build mode:** tap a tile to place the chosen item, drag to paint, and use the bar at the bottom to choose items and switch the four views. Big "Undo" and "Done" buttons.
- Works in portrait and landscape. All touch targets are at least 44 × 44 pixels.

A gamepad may come later (section 19).

---

## 15. Accessibility

- **Text first:** all dialogue, menus and the diary are normal page text, so screen readers can read them, the browser can zoom them, and translation tools work.
- **Text size:** three sizes. High-contrast text boxes. Dialogue moves on only when you press, never automatically.
- **Furigana** (decided on 10 November 2026): a setting that shows readings over kanji, for children and Japanese learners. It is off by default. The game shows them as small ruby text above the kanji (HTML `<ruby>`). The readings come from a reading list, `lang/ja-readings.js`, with every kanji word the game uses (including the kana after it where that changes the reading). A line where a word is read differently marks it in `lang/ja.js`, for example `[源|げん]さん` (changed on 12 November 2026; before, every line was to be marked).
- **Font:** the pixel-style font (section 16) by default, with a setting to switch to the device's standard font, which some players find easier to read.
- **No time pressure:** the clock stops while reading and planning, and there's a relaxed clock setting. Nothing needs quick reactions.
- **Colour:** the four views and all important tiles use shapes and patterns as well as colour (dense and spaced panels look different, and water has wave lines). All three art styles are checked for colour-blind readability before the choice is final.
- **Motion and flashing:** follows the device's "reduce motion" setting. There are no flashes (the typhoon uses wind and rain, never lightning flashes).
- **Sound:** every sound that matters also has a visual sign (a "!" for species, a speech bubble for calls). Separate volume for music and sounds.
- **Controls:** everything works with keyboard only, mouse only or touch only. Key remapping comes later.
- **Saving:** autosave every evening. You can't lose progress by closing the browser.

### 15.1 In the game (since Milestone 3.3)

- **Text size:** Settings has three sizes, Normal, Large and Extra large (all text 1×, 1.15× and 1.3×). On a phone, the top bar wraps onto two lines at the largest size.
- **Furigana:** a setting, off by default, that works only in Japanese.
  - **Where:** readings appear above every kanji on the page: dialogue, name tags, the top bar, windows, choices and the notebook.
  - **The reading list:** `lang/ja-readings.js` has about 1,450 words. It includes the kana after a word where that changes the reading (来て, 来る), and numbers with their counters (3日目 = みっかめ, 2人 = ふたり).
  - **Screen readers:** the readings are hidden from them, so each word is read once.
  - **Checks:** `tests/check.js` makes sure every kanji has a reading and every kanji word is in the list as a whole, so new texts can't be missed.

---

## 16. Look and sound

- **Pixel art:** 16 × 16 tiles, original and drawn in code, with an own colour palette of 28 colours (style A, including a vermilion for the shrine's torii gate). The ground and trees change colour with the seasons. No downloaded images or sounds. The only downloaded file is the font.
- **Font: a free pixel-style Japanese font** (decided on 10 November 2026). Proposed: **DotGothic16** (from Google Fonts, under the SIL Open Font License, which allows free use in games). It is used for dialogue, menus and the diary, so the text matches the pixel art. Only the characters the game uses are downloaded, which keeps the file small. The download needs your OK first, in Phase 1.
- **Characters:** 16 × 16 with large heads (a cute, chunky look), 4 walking directions and 2–3 frames each, plus blinking. Each resident has a clear outline shape (Gen-san's headband towel, Midori's bucket hat and binoculars, Kurokawa's suit).
- **Art style: A, "Sunspot pastel"** (chosen on 10 November 2026). Soft, warm and light colours from one palette of 27 colours. Outlines are a darker shade of the colour next to them, so shapes look gentle. `art-test.html` keeps all three options for reference.
- **The world on screen:** the canvas shows about 20 × 11 tiles, scaled up in whole steps so pixels stay crisp. Day turns gently to evening light and night (a colour wash over the canvas).
- **Sound (later):** simple Web Audio made in code, with no sound files: soft original tunes in a Japanese-sounding five-note scale, the evening chime, frogs in the rainy season, cicadas in summer, crickets in autumn and wind chimes (風鈴). Music can be turned off.
- **Never copy:** same genre as other cozy village games, but its own name, story, characters, map, art and music. When drawing, we check that no tile or character resembles a known game.

### 16.1 Sound in the game (since Milestone 3.3)

- **Made in code:** all music and sounds are made in code with the browser's Web Audio (`js/sound.js`), and the tunes are written down in `js/music.js`. There are no sound files. They were approved on the listening page `sound-test.html` on 12 November 2026.
- **Music:** six original tunes in five-note scales:
  - daytime 6:00–16:00, evening 16:00–19:00, night
  - a festival tune at the festivals on the map (not at the quiet firefly evening)
  - the community hall tune in hall scenes, and the ending tune
  - no music on the typhoon day
  - Each tune rests a few seconds before it repeats.
- **Nature** (`js/soundscape.js`):
  - rain, and the storm on the typhoon day
  - birds on spring and summer mornings
  - frogs on spring and summer evenings and in the rain
  - cicadas and wind chimes on summer days
  - crickets on autumn nights
  - quiet in the snow
- **Short sounds:** someone speaking, choosing, receiving something, money, building, a new species, a new heart, knocking at a door, and the evening chime (an original four-note melody) at 17:00 and before the morning announcement.
- **Settings:** a volume slider for music and one for sounds (0 turns them off), and a sound on/off button on the title screen. Sound starts with the first tap or key press, because browsers require it.
- **Visual signs:** the chime also shows the hint "The evening chime…", and every species still shows its "!".

---

## 17. Technical approach

- **Plain HTML, CSS and JavaScript**, with no tools to install for playing. Scripts are **classic scripts** (not modules), so the game opens by double-clicking `index.html`, from a folder or a USB stick.
- **The world on a canvas:** the map, characters and animals are drawn on an HTML canvas at a small internal size (for example 320 × 180 pixels) and scaled up with crisp pixels.
- **Dialogue and menus as page text:** conversations, the diary, the notebook, build mode buttons and menus are normal HTML on top of the canvas. They are readable, translatable and accessible.
- **Languages:** all text lives in `lang/ja.js` and `lang/en.js` and is looked up by a code, for example `t('gen.greet.1')`. The language system is copied from Solar Commons (`js/i18n.js`) and adapted. Players switch language at any time.
- **Pixel art in code:** each tile and character is written in the code as a small grid of letters, one letter per pixel, where each letter stands for a palette colour. A tool (`tools/make-sprites.js`, using the PNG maker from Solar Commons' `tools/make-icons.js`) turns these into PNG sprite sheets. The game loads them as normal images, which also works on double-click. Phase 0's art test draws the same kind of grids directly in the browser.
- **Font file:** `tools/make-fonts.js` (copied from Solar Commons) collects every character in the language files, downloads just those characters of the font and saves them in `fonts/`, together with the font's licence. The game then works offline and on double-click. The automatic checks make sure every character the game uses is in the font file.
- **Saving:** in the browser's own storage (localStorage) on the device. No accounts and no server.
- **Offline and installable (later):** once it's on its own website (GitHub Pages), the game gets an offline file (`sw.js`) and an app manifest, copied from Solar Commons, so it can be installed on a phone and played without internet. This only works from the website, not on double-click.
- **Sound:** Web Audio made in code (Phase 3 or 4).
- **Automatic checks with Node** (`tests/check.js`, like in Solar Commons): every text exists in both languages, no text is written directly in the code, every sprite is exactly 16 × 16 with known colours, the map has no unreachable places, simulated years always reach an ending, and saving then loading gives the same game.
- **Targets:** smooth on a mid-range phone, a download under 2 MB, and the current versions of Chrome, Edge, Safari (also on iPhone) and Firefox.
- **Website:** its own GitHub repository and GitHub Pages site later. The repository must be public for GitHub Pages, so we will ask you before creating it.

---

## 18. Scope and milestone plan

| Phase | What | Result |
|---|---|---|
| **0** | Concept and art style (this document and `art-test.html`) | Done: concept, residents, names and art style A approved on 10 November 2026 |
| **1** | Small playable test: walking on computer and phone, 2 residents (Gen-san and Midori) with dialogue and hearts, 1 plot (home field) in build mode with panels, hedges and meadow, the first 3–5 species in the diary, 3 days, saving. Then **playtests with 3–5 people from the public.** | Answers to "Is it fun? Is it clear? Would you play on?" |
| **2** | Core systems, in 5 milestones: **2.1** the full map, time, the 4 × 7 days, weather and autosave. **2.2** all residents with routines, hearts, gifts and requests, and the dialogue system. **2.3** all six plots, build mode with the four views, power and money, the shop. **2.4** "Village decisions": the community hall room, the worries list and nemawashi, the 説明会 scene, the farmland permit, the citizen fund, Kurokawa's offers, the forest slope with the water view and the rainy-season mudflow, the promotion zone workshop, letters, the three meters and the ending framework. **2.5** "Nature and festivals": the nature diary with all habitats (about 32 species) and Midori's survey, the festival and special days as scenes, the typhoon shelter night and gifts to the village, and the free year. (2.4 and 2.5 were one milestone until 12 November 2026.) | A complete year, with placeholder story |
| **3** | Story and content, in 3 milestones (planned on 12 November 2026): **3.1** "Friendships" (built on 12 November 2026, section 6.1); **3.2** built on 12 November 2026 (sections 11.1, 12.1 and 13.1); **3.3** built on 12 November 2026 (sections 15.1 and 16.1): the four player looks, all heart events (including Kurokawa's arc), keepsakes, and one more request for each household. **3.2** "The village's story": the village notebook (researched facts, checked with `docs/fact-check.md`), the full endings and epilogues, and more varied everyday lines, news, festival and meeting texts. **3.3** "Sound and reading": music and sounds made in code, the furigana setting and three text sizes. About **800–1,500 dialogue lines per language.** | The full game in Japanese and English |
| **4** | Polish and release, in 1–2 milestones: accessibility check, phone performance, offline and installing, the app icon, final playtests, and publishing on GitHub Pages (after your OK) | The public release |

**Not in the first release:** multiplayer, more than one year of story (the free year has no new story), a gamepad (maybe later), voice acting. Romance is not planned at all (friendships only).

---

## 19. Open questions

1. **Names (approved as working names, 10 November 2026):** "Hidamari / ひだまり村", "power garden / おひさまの庭", "Quick Solar Co. / クイックソーラー株式会社" and the town of Komorebi (こもれび町). Before release, check that they don't clash with existing works or companies (there is a well-known manga and anime called *Hidamari Sketch*, and "ひだまり" is a common name for cafés and care homes).
2. **Residents (approved, 10 November 2026):** the ten characters, including Rin as Fumiko's granddaughter. Details can still change in Phase 3.
3. **The premise (approved, 10 November 2026):** you come as a regional revitalisation cooperator (地域おこし協力隊).
4. **Calendar:** 28 days from April to just after New Year, with stylised "weeks" for seasons. Is that OK?
5. **Romance (decided, 10 November 2026):** friendships only.
6. **The player (decided, 12 November 2026):** a name and one of four looks, two male and two female.
7. **Speech style (decided, 12 November 2026):** standard Japanese, with a light flavour for each character (for example Gen-san's わし and 〜とる). No made-up or real regional dialect.
8. **Fonts (decided, 10 November 2026):** a free pixel-style Japanese font, proposed DotGothic16. The download needs your OK in Phase 1.
9. **Furigana (decided, 10 November 2026):** yes, as a setting (off by default).
10. **After the ending (decided, 10 November 2026):** a free year (section 12).
11. **Real facts (decided, 12 November 2026):** every real fact in the game is listed in `docs/fact-check.md`, with where it appears and what to check, so it can be checked before release.
12. **Playtesters for Phase 1:** who are the 3–5 people from the public, and should they play on phones, computers or both?
