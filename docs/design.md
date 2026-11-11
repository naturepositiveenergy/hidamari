# Hidamari (ひだまり村) — working title

**Game Design Document v0.2** | Approved on 10 November 2026

*Changes in v0.2 (from the Phase 1 test, approved on 10 November 2026): you can pick wild strawberries as gifts (section 6), built panels and hedges block the way but meadow doesn't (section 7.2), the game also saves when a new game starts (section 2), and Gen-san and Midori follow simpler routines in the Phase 1 test (section 5).*

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

The player character has a name you choose and no fixed gender. Game text never needs he or she for the player.

**In the test versions before Milestone 2.2**, Gen-san and Midori follow simpler routines:
- **Gen-san:** at his paddy in the morning, at home at noon and in the evening, and under the big tree in the afternoon.
- **Midori:** at the pond at dawn, at the post office during the day, by the stream in the afternoon, and at the rice terraces in the evening.

The full routines below come in Milestone 2.2.

### 5.1 Gen-san (源さん), rice farmer

- **Daily routine:** dawn at his paddy checking the water. Mornings in the fields. Noon on his veranda. Afternoons on the bench outside Hiro's shop with tea. On rainy days he repairs tools in his barn.
- **Loves:** dried persimmons (干し柿), rice balls (おにぎり). **Likes:** pickles, green tea, fresh vegetables, a whetstone. **Dislikes:** fancy city snacks, anything from Quick Solar Co.
- **Worry:** "Fields must stay fields." He is the last farmer in his family; his son lives in Nagoya. Who will farm after him?
- **As a friend:** at 2♥ you can plant shade-tolerant crops under spaced panels on your home field, with his advice. At 4♥ he offers his paddy [3] for agrivoltaics. He teaches rice planting and harvest.
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
- **As a friend:** at 2♥ she has ideas (a solar charging bench at the bus stop, sun-powered festival lanterns). At 4♥ she brings student volunteers to a work day. She clashes with Fumiko.
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
- **As a friend:** at 2♥ she explains the permits and opens the old factory site [5]. At 3♥ she runs the zoning workshop for the promotion zone. At 4♥ she helps with a support scheme grant.
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

- **One gift per resident per day.** Each resident has 1–2 loved and 3–4 liked gifts. Residents' words hint at them ("Gen-san keeps looking at the persimmon tree…").
- **Where gifts come from:** things you grow, buy or find. Once a day you can pick wild strawberries (クサイチゴ) at a few bushes: a small gift that costs nothing.
- **Heart events** start when a resident has enough hearts and the place, time and season fit. A small sun icon over their head shows that one is waiting. Events tied to a season have a fallback, so you can't miss them for good.
- **Requests** come by letter or on the board outside the community hall: small tasks of 5–20 minutes such as fetching, finding, helping or delivering. They give points, sometimes money, seeds or items.
- **Balance goal:** in one year, a player can reach 5 hearts with about 4 residents and 3 hearts with most others. You can't befriend everyone fully, and that's fine.
- **Friendships only, no romance** (decided on 10 November 2026). Many games in this genre have romance and marriage. Hidamari is a game for everyone about community, so hearts measure friendship.

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
- **Building:** small plans (up to 8 tiles) you build alone. Each tile takes 15 in-game minutes. Bigger plans need a **work day** (結, yui): you pick a day, and friends with ♥2 or more come to help. The more helpers, the faster it goes, and the work day is a small scene with jokes and lunch.
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

**Upkeep:** no weed killer. A meadow is mowed by hand (a short task in summer and autumn), or, once Gen-san knows someone, by two rented goats (ヤギ除草, a real practice and a cute sight).

### 7.3 The Solar Commons rules, made visible: the four views

In build mode, four buttons switch on a **view** that draws its rule on the plot, so players *see* why a design is good, not just a score. These are the same placement rules as in Solar Commons, as simple things to look at.

1. **Wind view: hedges on the edge shelter the park in a typhoon.**
   Arrows show the typhoon wind coming in from the south and east. A panel is *sheltered* if a hedge stands between it and the plot edge on the windward side. Exposed panels glow orange. On typhoon night (autumn day 2), about half of the exposed panels come loose and stop working until you repair them (a task and a small cost). Sheltered panels are always fine. Hedges inside the plot still give nature points but don't shelter anything.

2. **Wildlife view: connected wildlife corridors bring animals.**
   Corridor tiles, hedges and meadows that touch each other form a chain. When a chain touches the edge of the plot *and* a pond, hedge or meadow, it lights up with little footprints and counts as connected. Connected corridors bring animals into the garden: the raccoon dog (タヌキ) and the Japanese weasel (イタチ) can only appear in a garden with one. Corridor tiles that aren't connected cost money but bring nothing, and the view shows them grey.

3. **Light view: spaced panels let the crops underneath grow.**
   It shows how much shade falls on the crops. Under dense panels, nothing grows (dark). Under spaced panels, there's dappled light (light), and crops planted there grow. On Gen-san's paddy [3], the share of shade must stay **under 30%** for a good harvest (the real rule for agrivoltaics from April 2027). In the game, dense panels count as full shade and spaced panels as light shade, so in practice the paddy needs spaced panels. The light meter turns green under 30%.

4. **Water view: a forest slope is cheap but risky in the rainy season.**
   On the slope [6], arrows show where rain runs off. Cleared ground without drainage shows brown arrows running down to the stream and the river. Adding drainage (+20% cost) and a small retention pond turns them blue. In the rainy season (summer days 1–3), a slope garden without drainage causes a mudflow (section 7.4). On other plots the view shows the water staying put, which also shows why flat sites are safer.

The views use **shapes and icons as well as colour**: arrows, footprints, shading patterns. Players with colour blindness can read them too.

### 7.4 What happens on the slope

- **Why it tempts:** the lease is cheap, there are no fields to protect and no one lives next to it, and Kurokawa's crew builds it in one day.
- **Rainy season:** on summer day 3, a slope garden without drainage sends mud into the stream. The next morning, the stream is brown, the road below is muddy for a day, the firefly count at the festival falls, frogs leave the stream for the rest of the summer, and Kuma-san, Midori and Fumiko lose hearts. The next 説明会 is harder ("We've seen what solar does").
- **Afterwards:** Ms. Sato starts a local solar ordinance (条例): from then on, forest slopes are closed for new gardens, and all 説明会 need the 自治会's clear agreement. You can help clean up (a work day, hearts back) and, with Kurokawa ♥4, restore the slope by replanting trees and building a retention pond, which brings the frogs and fireflies back the next year (shown in the ending).
- **With drainage:** the risk is small (a 10% chance of a small, harmless runoff that teaches the point without harm).
- **Not game over:** the slope teaches the lesson, but the story always continues.

### 7.5 Sun-power and money from gardens

- Each panel tile makes power every day: sunny 100%, cloudy 50%, rain 20%, snow 10% (until you sweep the panels). Loose or unrepaired panels make nothing.
- The power is used first by the community hall, the shop and the households that joined, then sold. In the game, power is simply turned into money each evening (first guess: ¥150 per power point).
- **Balance goal:** a well-built garden pays back its cost in about two seasons, so building early in spring pays off, but a summer garden still earns back most of its cost by New Year.

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
| Village | Barn swallows (nests under the shop roof in spring), green pheasant | Always there in the right season |

- **About 32 species** in total. One playthrough can find about 20–25, so the diary also gives a reason to play again.
- Each entry has: a pixel sketch, the name (Japanese and English), where and when you saw it, and one short fact ("Fireflies need clean water: their larvae eat a small water snail called kawanina").
- **Garden nature score:** like biodiversity in Solar Commons. Nature points from the tiles, plus a bonus for variety (each different nature tile type, and spaced panels, count once). Midori's nature survey shows it. Some species only appear in gardens above a score (for example the kingfisher needs a pond garden with score 30 or more).
- **Seasons in the diary:** spring = butterflies, frogs, swallows. Summer = fireflies, dragonflies, beetles, cicadas. Autumn = red dragonflies, crickets, shrikes. Winter = tracks, winter birds, the かいぼり pond draining.
- Species facts will be checked in Phase 3 (section 13).

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
- **Kurokawa** may sit in the back row and make a slick offer during the meeting, a moment for the player to answer.

### 10.2 The citizen fund (市民ファンド)

- After a successful 説明会, Hiro (♥2) suggests a citizen fund, and Ms. Sato helps with the paperwork. You open it for one garden for 3 days.
- **Who invests:** residents with ♥3 or more, more with more hearts (first guess: ♥3 ¥10,000, ♥4 ¥25,000, ♥5 ¥50,000). The Mori family invests from ♥4, and Hiro only if he trusts you. Trust falls if you sold land or a garden to Quick Solar Co., or if your slope garden caused the mudflow.
- **What they get:** a share of that garden's income, paid by letter each season ("My sun share bought Sora new shoes!"). Investors talk about "our garden" and look after it.
- **Effect:** money for building, ♥ for investors, and the Community meter rises. It's the key to the "Everyone's power" ending.

### 10.3 The rival: Quick Solar Co. (クイックソーラー株式会社)

- **Spring day 3:** Mr. Kurokawa arrives in a shiny car. He offers you two deals:
  - **(a) Lease him your home field** for a big sum now. You lose plot [1] for the year.
  - **(b) Partner on the forest slope:** his cheap kit and crew, your local face. The garden is built in one day, with dense panels and no drainage, and you get a share of the money.
- **If you accept (b):** you earn money from spring, but the slope consequence in the rainy season falls on *you* (section 7.4). Residents lose more hearts, Hiro won't invest, and the 説明会 is harder.
- **If you decline:** Kurokawa builds a smaller slope park himself. The mudflow still happens, but the village doesn't blame you, and helping to clean up earns hearts.
- **Preventing it:** if Mr. Oda is at ♥3 before the summer, you can ask him to write to the slope's owner in Tokyo. The owner refuses Kurokawa's lease, the slope stays forest, and Ms. Sato tells the story of the other town instead. Kurokawa grumbles and keeps visiting.
- **Autumn:** Kurokawa offers to buy your finished power garden for 1.5 times its cost. If you sell, Quick Solar Co. cuts the hedges and sprays weed killer, species leave, and investors are hurt. It's never forced.
- **His arc:** Kurokawa is a person under pressure, not a villain. Befriending him (section 5.10) leads to him helping restore the slope and, in the best case, joining the village.

### 10.4 The promotion zone (促進区域) with Ms. Sato

- **Autumn day 1, the zoning workshop:** Ms. Sato (♥3) invites everyone to the community hall. A big map of the village lies on the table. Residents place green (welcome), yellow (careful) and red (no) stickers on the plots. You can talk with them as they decide. Their choices depend on their worries and on what has happened, so after a mudflow the slope always gets red.
- **Result:** a promotion zone map, usually the factory site and parts of the paddies in green and the slope in red. Gardens in the zone get faster permits (no extra permit days), a small support grant (with Ms. Sato ♥4) and a warmer start at the 説明会.
- **Support schemes:** Ms. Sato explains in plain words why it matters: new ground-mounted solar parks no longer get fixed-price support from fiscal year 2027, but certified projects in promotion zones may keep it (a proposal being decided around January 2027; see section 13).

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
| Grazing goats under panels (ヤギ除草) | Renting the goats | New: to research |

**"Reviewed in Solar Commons"** means the text was researched and approved there (see Solar Commons `docs/policy-notebook.md`) and will be shortened for this game. Facts that change (FIT/FIP exceptions, promotion zones) must be checked again before release. The new entries will be researched and given to you for review in Phase 3.

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
- **Furigana** (decided on 10 November 2026): a setting that shows readings over kanji, for children and Japanese learners. It is off by default. The Japanese language file marks readings, for example `[源|げん]さん`, and the game shows them as small ruby text above the kanji (HTML `<ruby>`).
- **Font:** the pixel-style font (section 16) by default, with a setting to switch to the device's standard font, which some players find easier to read.
- **No time pressure:** the clock stops while reading and planning, and there's a relaxed clock setting. Nothing needs quick reactions.
- **Colour:** the four views and all important tiles use shapes and patterns as well as colour (dense and spaced panels look different, and water has wave lines). All three art styles are checked for colour-blind readability before the choice is final.
- **Motion and flashing:** follows the device's "reduce motion" setting. There are no flashes (the typhoon uses wind and rain, never lightning flashes).
- **Sound:** every sound that matters also has a visual sign (a "!" for species, a speech bubble for calls). Separate volume for music and sounds.
- **Controls:** everything works with keyboard only, mouse only or touch only. Key remapping comes later.
- **Saving:** autosave every evening. You can't lose progress by closing the browser.

---

## 16. Look and sound

- **Pixel art:** 16 × 16 tiles, original and drawn in code, with an own colour palette of 28 colours (style A, including a vermilion for the shrine's torii gate). The ground and trees change colour with the seasons. No downloaded images or sounds. The only downloaded file is the font.
- **Font: a free pixel-style Japanese font** (decided on 10 November 2026). Proposed: **DotGothic16** (from Google Fonts, under the SIL Open Font License, which allows free use in games). It is used for dialogue, menus and the diary, so the text matches the pixel art. Only the characters the game uses are downloaded, which keeps the file small. The download needs your OK first, in Phase 1.
- **Characters:** 16 × 16 with large heads (a cute, chunky look), 4 walking directions and 2–3 frames each, plus blinking. Each resident has a clear outline shape (Gen-san's headband towel, Midori's bucket hat and binoculars, Kurokawa's suit).
- **Art style: A, "Sunspot pastel"** (chosen on 10 November 2026). Soft, warm and light colours from one palette of 27 colours. Outlines are a darker shade of the colour next to them, so shapes look gentle. `art-test.html` keeps all three options for reference.
- **The world on screen:** the canvas shows about 20 × 11 tiles, scaled up in whole steps so pixels stay crisp. Day turns gently to evening light and night (a colour wash over the canvas).
- **Sound (later):** simple Web Audio made in code, with no sound files: soft original tunes in a Japanese-sounding five-note scale, the evening chime, frogs in the rainy season, cicadas in summer, crickets in autumn and wind chimes (風鈴). Music can be turned off.
- **Never copy:** same genre as other cozy village games, but its own name, story, characters, map, art and music. When drawing, we check that no tile or character resembles a known game.

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
| **2** | Core systems, in 3–4 milestones: **2.1** the full map, time, the 4 × 7 days, weather and autosave. **2.2** all residents with routines, hearts, gifts and requests, and the dialogue system. **2.3** all six plots, build mode with the four views, power and money, the shop. **2.4** the nature diary with all habitats, the 説明会 scene, the citizen fund, the typhoon and rainy season, and the ending framework. | A complete year, with placeholder story |
| **3** | Story and content, in 2–3 milestones: heart events, festivals, Kurokawa's arc, the village notebook (researched facts for your review), the endings and the free year, furigana, sound and music. About **800–1,500 dialogue lines per language.** | The full game in Japanese and English |
| **4** | Polish and release, in 1–2 milestones: accessibility check, phone performance, offline and installing, the app icon, final playtests, and publishing on GitHub Pages (after your OK) | The public release |

**Not in the first release:** multiplayer, more than one year of story (the free year has no new story), a gamepad (maybe later), voice acting. Romance is not planned at all (friendships only).

---

## 19. Open questions

1. **Names (approved as working names, 10 November 2026):** "Hidamari / ひだまり村", "power garden / おひさまの庭", "Quick Solar Co. / クイックソーラー株式会社" and the town of Komorebi (こもれび町). Before release, check that they don't clash with existing works or companies (there is a well-known manga and anime called *Hidamari Sketch*, and "ひだまり" is a common name for cafés and care homes).
2. **Residents (approved, 10 November 2026):** the ten characters, including Rin as Fumiko's granddaughter. Details can still change in Phase 3.
3. **The premise (approved, 10 November 2026):** you come as a regional revitalisation cooperator (地域おこし協力隊).
4. **Calendar:** 28 days from April to just after New Year, with stylised "weeks" for seasons. Is that OK?
5. **Romance (decided, 10 November 2026):** friendships only.
6. **The player:** choose a name only, or also one of three looks?
7. **Speech style:** should older residents speak a light, made-up countryside dialect in Japanese, or standard Japanese? A real regional dialect could feel like a caricature.
8. **Fonts (decided, 10 November 2026):** a free pixel-style Japanese font, proposed DotGothic16. The download needs your OK in Phase 1.
9. **Furigana (decided, 10 November 2026):** yes, as a setting (off by default).
10. **After the ending (decided, 10 November 2026):** a free year (section 12).
11. **Real facts:** who will review the new notebook entries and the species facts (you, colleagues at ISEP, Midori's real-life equivalent)?
12. **Playtesters for Phase 1:** who are the 3–5 people from the public, and should they play on phones, computers or both?
