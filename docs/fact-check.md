# Hidamari: real facts to check

This list collects every real-world fact the game states, so it can be checked before release (decided on 12 November 2026, `design.md` section 19, question 11). For each fact it gives:
- what the game says, in short
- where it appears: the text code in `lang/en.js` and `lang/ja.js` (both languages say the same thing)
- what exactly to check

**Status:** all entries start as "To check". Change an entry to "OK", or to "Change: …" with the correction. Facts that change over time (sections A and E) must be checked again just before release.

Made on 12 November 2026, for the game as it is after Milestone 2.5.

---

## A. Energy policy and rules

These change over time, so they are the most important to check.

| # | The game says | Where | What to check | Status |
|---|---|---|---|---|
| A1 | On farmland with panels (agrivoltaics), the shade on the crops must stay under 30% (the rule from April 2027). | `build.shade`, `build.shadeWarn`, design 7.3 | The real shading threshold for agrivoltaics, and the date it applies from. | Confirmed on 12 Nov 2026 (see `docs/village-notebook.md`) |
| A2 | If the rice under the panels gets too little light, "the agricultural committee will give guidance". | `summary.harvest.poor` | What really happens when the harvest under agrivoltaics falls short (the yield check, the agricultural committee's role). | Confirmed on 12 Nov 2026 (see `docs/village-notebook.md`) |
| A3 | Spaced panels over crops need no farmland conversion permit; dense panels on farmland wait for one. | `build.p.permit`, `meeting.result.permit`, design 7.1 | **Probably a simplification.** In reality, agrivoltaics also needs a temporary conversion permit (一時転用) for the posts. Decide whether the text should say this. | Corrected in the game on 12 Nov 2026 (see `docs/village-notebook.md`) |
| A4 | The government plans to end fixed-price support for new ground-mounted solar parks from fiscal year 2027, but projects in promotion zones may keep it. It's still being decided. | `zone.result.3`, design 10.4 | The current state of this decision. Design 10.4 expected a decision around January 2027. | Confirmed on 12 Nov 2026 (see `docs/village-notebook.md`) |
| A5 | Promotion zones (促進区域): projects there get their permits faster, and the town supports them. | `zone.open.3`, `zone.result.2` | What the real promotion zone system offers (one-stop permits, support), and what is game simplification. | Confirmed on 12 Nov 2026 (see `docs/village-notebook.md`) |
| A6 | A solar company holds its own briefing for residents (Kurokawa: "My company holds the briefing in town"). | `kuro.partner.sure`, `letter.quickPark.2` | The briefing rule for solar projects (required since April 2024, design 13): who must hold it and for which projects. | Confirmed on 12 Nov 2026 (see `docs/village-notebook.md`) |
| A7 | After a mudflow, the town makes a solar ordinance: no new solar parks on forest slopes, and clear agreement from the residents' association. | `letter.ordinance.1`, `letter.ordinance.2`, `announce.ordinance`, `meeting.note.ordinance` | That real local ordinances (条例) restrict solar on slopes or require local agreement. Find an example or two. | Confirmed on 12 Nov 2026 (see `docs/village-notebook.md`) |
| A8 | Towns support batteries at evacuation shelters. | `shelter.lit.sato` | Whether national or local support for batteries at shelters exists (for example, resilience subsidies). | Corrected in the game on 12 Nov 2026 (see `docs/village-notebook.md`) |
| A9 | Paddies hold rainwater like small dams and protect the houses below. | `fest.taue.sato` | The "paddy dam" (田んぼダム) idea. | Confirmed on 12 Nov 2026 (see `docs/village-notebook.md`) |
| A10 | Slopes and heavy rain don't mix; Ms. Sato saw a landslide at a solar park in another town. | `sato.chat.slope`, `slope.sato.1`, design 5.9 | That landslides and mudflows from solar parks on slopes have happened in Japan (the story itself is fiction). | Confirmed on 12 Nov 2026 (see `docs/village-notebook.md`) |

## B. Village life and customs

| # | The game says | Where | What to check | Status |
|---|---|---|---|---|
| B1 | You are a regional revitalisation cooperator (地域おこし協力隊) who moves to the village. | `intro.2`, design 1 | How the programme works (who joins, how long). The game's allowance of ¥40,000 per season is a game number, not real pay. | Checked 13 Nov 2026: 総務省 (see `docs/village-notebook.md`, entry 1) |
| B2 | At the shrine you bow twice, clap twice and bow once more. | `obj.door.shrine` | The usual shrine etiquette (二礼二拍手一礼). | Standard knowledge, not looked up (13 Nov 2026): low risk |
| B3 | Nemawashi (根回し): before you move a tree you loosen the earth around its roots; before a meeting you talk to everyone. | `nema.lesson.1`, `nema.lesson.2` | The origin and meaning of the word. | Checked 13 Nov 2026: 愛媛県, weblio (notebook entry 4) |
| B4 | Yui (結): villagers help each other, for example with rice planting. | `fest.taue.oda`, design 7.2 | The meaning of yui. | Checked 13 Nov 2026: 国土交通省 多言語解説文 (notebook entry 3) |
| B5 | The evening chime plays at 17:00 over the village loudspeaker, and the shop closes. | `hint.chime`, design 2 | That villages play an evening chime (times vary by place and season). | Standard knowledge, not looked up (13 Nov 2026): low risk |
| B6 | The shop drives round to older residents who can't walk to it. | `hiro.chat.delivery` | Mobile shops (移動販売) in rural Japan. | Standard knowledge, not looked up (13 Nov 2026): low risk |
| B7 | On the winter solstice, a yuzu bath keeps colds away, people say. | `fest.solstice`, `announce.news.22` | The custom. | Standard knowledge, not looked up (13 Nov 2026): low risk |
| B8 | At New Year's Eve the village visits the shrine at midnight, rings the bell, makes a wish and draws a fortune: great blessing, blessing, small blessing. | `fest.hatsumode.1`, `.great`, `.good`, `.small` | The first shrine visit (初詣), the bell and the fortune slips (おみくじ). | Standard knowledge, not looked up (13 Nov 2026): low risk |
| B9 | Amazake is "warm and sweet, and no alcohol, so the kids can have some too". | `fest.hatsumode.hiro` | **Check:** amazake made from rice koji has no alcohol, but amazake made from sake lees has a little. Say which kind, or change the line. | Corrected in the game on 12 Nov 2026 (see `docs/village-notebook.md`) |
| B10 | The first sunrise of the year (初日の出). | `fest.sunrise.1`, `announce.news.26` | The custom. | Standard knowledge, not looked up (13 Nov 2026): low risk |
| B11 | Kaibori: in winter the pond is drained and cleaned. Bluegill and bass are removed, and native fish (rice fish, loaches, crucian carp) go back. | `kuma.chat.winter`, `fest.kaibori.1`, `fest.kaibori.2`, `fest.kaibori.kuma` | How kaibori is done, and that bluegill and largemouth bass are invasive in Japan. | Standard knowledge, not looked up (13 Nov 2026): low risk |
| B12 | An irrigation pond (ため池) about 300 years old waters the paddies of 12 families, and the families decide together. | `kuma.meet.2`, `kuma.meet.3`, `plot.open.pond.1`, design 5.7 | How irrigation ponds are managed and decided on (irrigation associations, land improvement districts). The pond itself is fiction. | Checked 13 Nov 2026: 農林水産省 ため池とは (notebook entry 15); the pond is fiction |
| B13 | A seedling paddy wants water "two fingers deep". | `gen.ev1.3` | Typical water depth after rice planting. | Checked 13 Nov 2026: prefectural rice guides (富山県, 山形県): 4–5 cm just after planting, 2–3 cm later; "two fingers" is fair |
| B14 | The community hall is the village's evacuation shelter. | `obj.door.hall`, `fest.shelter.time` | Common practice (公民館 as shelter). | Standard knowledge, not looked up (13 Nov 2026): low risk |
| B15 | Some solar parks are built on gravel and sprayed with weed killer, so nothing lives there. | `midori.ev1.5`, `worry.midori.ask`, `kuro.buy.narr` | That this practice exists (and is not the rule everywhere). | Standard knowledge, not looked up (13 Nov 2026): low risk |
| B16 | Summers are getting hotter every year. | `rin.chat.summer`, `rin.chat.hall` | The temperature trend in Japan. | Standard knowledge, not looked up (13 Nov 2026): low risk |
| B17 | Fireflies talk with their light, and torches confuse them; keep lights low at a firefly evening. | `fest.hotaru.midori`, `announce.fest.hotaru` | That artificial light disturbs fireflies' signalling. | Checked 13 Nov 2026: 環境省 里地里山 (keep artificial light away while fireflies fly) |

## C. The nature diary

Each species has a fact (`species.<name>.fact`) and a hint about where and when to find it (`species.<name>.hint`). The hints follow the game's own rules (seasons, hours, habitats), but they should still match real life roughly.

| # | Species | The game says (`species.<name>.fact`) | What to check | Status |
|---|---|---|---|---|
| C1 | Cabbage white (モンシロチョウ) | One of the first butterflies of spring; caterpillars eat cabbage-family plants. | Host plants, season. | Standard knowledge, not looked up (13 Nov 2026): low risk |
| C2 | Pale grass blue (ヤマトシジミ) | Caterpillars eat only creeping wood sorrel (katabami). | "Only" katabami. | Checked 13 Nov 2026: 化学と生物 (2020): caterpillars eat only katabami (single-food) |
| C3 | Small copper (ベニシジミ) | Caterpillars eat sorrel and dock. | Host plants. | Standard knowledge, not looked up (13 Nov 2026): low risk |
| C4 | Yellow swallowtail (キアゲハ) | Caterpillars eat carrot-family plants such as Japanese parsley and carrots. | Host plants. | Standard knowledge, not looked up (13 Nov 2026): low risk |
| C5 | Japanese honeybee (ニホンミツバチ) | Native; nests in hollow trees; can kill a hornet by surrounding it in a hot ball of bees. | The "heat ball" defence. | Standard knowledge, not looked up (13 Nov 2026): low risk |
| C6 | Long-headed grasshopper (ショウリョウバッタ) | One of Japan's biggest grasshoppers; the female is much bigger than the male. | Size claim. | Standard knowledge, not looked up (13 Nov 2026): low risk |
| C7 | Bell cricket (スズムシ) | The male rubs its wings to sing on autumn nights; kept for its song for centuries. | Song, history of keeping. | Standard knowledge, not looked up (13 Nov 2026): low risk |
| C8 | Japanese tree frog (ニホンアマガエル) | Often calls before rain; can change colour from green to grey. | Both claims. | Standard knowledge, not looked up (13 Nov 2026): low risk |
| C9 | Japanese brown frog (ニホンアカガエル) | Lays eggs very early (late winter to early spring) in shallow paddy water. | Breeding season. | Standard knowledge, not looked up (13 Nov 2026): low risk |
| C10 | Schlegel's green tree frog (シュレーゲルアオガエル) | Lays eggs in a white foam nest on the banks of paddies and ponds; heard more than seen. | Foam nests. | Standard knowledge, not looked up (13 Nov 2026): low risk |
| C11 | Common skimmer (シオカラトンボ) | The male is pale blue-grey, which gives the Japanese name; the yellow-brown female is called the "straw dragonfly". | Name origin, female's name (ムギワラトンボ). Also check the English name. | Checked 13 Nov 2026; English name corrected to "White-tailed skimmer" (Orthetrum albistylum) |
| C12 | Red dragonfly (アキアカネ) | Hatches in paddies in early summer, spends summer in the mountains, comes back down red in autumn. | Life cycle. | Standard knowledge, not looked up (13 Nov 2026): low risk |
| C13 | Water strider (アメンボ) | Water-repelling hairs on its legs let it stand on water; it feels the ripples of insects that fall in. | Both claims. | Standard knowledge, not looked up (13 Nov 2026): low risk |
| C14 | Japanese rice fish (メダカ) | Wild medaka have become rare and are on Japan's Red List. | The Ministry of the Environment Red List status. | Checked 13 Nov 2026: 環境省 (Vulnerable, 絶滅危惧II類) |
| C15 | Diving beetle (ゲンゴロウ) | Carries air under its wings when it dives; needs clean ponds with water plants; very rare now. | Air store, rarity. | Standard knowledge, not looked up (13 Nov 2026): low risk |
| C16 | Japanese tit (シジュウカラ) | Black cap, white cheeks, black "necktie"; sings "tsupi, tsupi"; nests in holes and nest boxes. | Call and nesting. | Standard knowledge, not looked up (13 Nov 2026): low risk |
| C17 | Warbling white-eye (メジロ) | Named for the white ring round its eye; loves camellia and plum nectar. | Both claims. | Standard knowledge, not looked up (13 Nov 2026): low risk |
| C18 | Japanese bush warbler (ウグイス) | Its spring song "ho-hokekyo" is famous, but the bird hides in bushes. | Song. | Standard knowledge, not looked up (13 Nov 2026): low risk |
| C19 | Bull-headed shrike (モズ) | Calls loudly from treetops in autumn; spikes prey on thorns ("hayanie"). | Both claims. | Standard knowledge, not looked up (13 Nov 2026): low risk |
| C20 | Daurian redstart (ジョウビタキ) | A winter visitor from the continent; keeps a winter territory; bobs its tail. | Note: it has started breeding in parts of Japan. Check whether "winter visitor" is still fair. | Corrected in the game on 12 Nov 2026 (see `docs/village-notebook.md`) |
| C21 | Grey heron (アオサギ) | The biggest heron you usually see in Japan; stands still, then strikes at fish and frogs. | Size claim. | Standard knowledge, not looked up (13 Nov 2026): low risk |
| C22 | Common kingfisher (カワセミ) | Called "the jewel of the stream"; dives for small fish and needs clear water. | Nickname, clear water. | Standard knowledge, not looked up (13 Nov 2026): low risk |
| C23 | Genji firefly (ゲンジボタル) | Larvae live in clean streams and eat the snail kawanina; mud and dirty water drive them away. | Larval food, habitat. | Checked 13 Nov 2026: 環境省 (kawanina, clean water) |
| C24 | Raccoon dog (タヌキ) | A wild member of the dog family, active at night; shared toilet spots work like a message board. | Latrines (ため糞). | Standard knowledge, not looked up (13 Nov 2026): low risk |
| C25 | Japanese weasel (ニホンイタチ) | A slim hunter of mice and frogs; needs cover such as long grass and hedges. | Prey, cover. | Standard knowledge, not looked up (13 Nov 2026): low risk |
| C26 | Japanese hare (ノウサギ) | Its tracks in snow show the big hind feet landing in front of the small front feet. | Track pattern. | Standard knowledge, not looked up (13 Nov 2026): low risk |
| C27 | Japanese squirrel (ニホンリス) | Buries nuts in autumn; forgotten ones can grow into trees. | Caching. | Standard knowledge, not looked up (13 Nov 2026): low risk |
| C28 | Rhinoceros beetle (カブトムシ) | Only the male has the big horn; comes to oak sap on summer nights. | Both claims. | Standard knowledge, not looked up (13 Nov 2026): low risk |
| C29 | Robust cicada (ミンミンゼミ) | Sings "meen-min-min" on summer days; larvae live underground for several years. | Song, larval years. Also check the English name. | Checked 13 Nov 2026 (secondary): nymphs live about 2–5 years, so "several years" is fair; English name corrected to "Min-min cicada" |
| C30 | Barn swallow (ツバメ) | Flies thousands of kilometres from Southeast Asia each spring; builds a mud nest under the eaves. | Migration, nest. | Standard knowledge, not looked up (13 Nov 2026): low risk |
| C31 | Green pheasant (キジ) | Japan's national bird; the male has a red face and long tail and calls "ken-ken". | All three. | Standard knowledge, not looked up (13 Nov 2026): low risk |
| C32 | Tree sparrow (スズメ) | Lives close to people and nests in gaps in roofs and walls; has become less common as old houses disappear. | The decline and its reason. | Checked 13 Nov 2026: Bird Research / 三上修: decline confirmed, but nest sites alone don't explain it; line reworded |

Other nature lines:

| # | The game says | Where | What to check | Status |
|---|---|---|---|---|
| C33 | Fireflies come to the stream in early summer and need clean water. | `midori.chat.stream`, `announce.news.10`, `announce.news.11` | Season. | Checked 13 Nov 2026: Genji fireflies fly in early summer (環境省) |
| C34 | Fireflies are a good test for a stream; the town checks the water every summer. | `fest.hotaru.sato` | Fireflies as a sign of water quality. (The town's check is fiction.) | Checked 13 Nov 2026: fireflies need clean, oxygen-rich water (環境省, 横浜市); the town's check is fiction |
| C35 | Hedges give birds food, shelter and nest sites ("a wall that sings"). | `midori.chat.hedgeBuilt`, `survey.tip.hedge`, design 5.2 | General claim. | Standard knowledge, not looked up (13 Nov 2026): low risk |
| C36 | A small pond brings frogs, dragonflies and maybe a kingfisher; meadows bring butterflies and bees; connected corridors let animals such as the raccoon dog come in. | `survey.tip.*`, `view.wildlife.hint` | General ecology. These are simplified on purpose; check that they are fair. | Standard knowledge, not looked up (13 Nov 2026): low risk |

## F. Heart events and requests (Milestone 3.1)

Real facts in the new heart events (`ev.*`) and the second requests (`*.req2.*`). The people, places and stories are fiction.

| No. | What the game says | Where (text codes) | What to check | Status |
|---|---|---|---|---|
| F1 | Small rooftop systems on buildings still get a fixed price for the power they sell. | `ev.hiro.3.4` | Whether small rooftop solar (for example under 50 kW) still gets FIT support from FY2027, and on what terms (see A4). | Confirmed on 12 Nov 2026 (see `docs/village-notebook.md`) |
| F2 | A solar park on a steep slope, with the trees cut and no drains, slid onto a road in a summer storm. | `ev.sato.2.2`, `ev.kurokawa.3.1`, `ev.kurokawa.3.2` | Same as A10: that such landslides have happened in Japan. | Confirmed 13 Nov 2026: same as A10 (経済産業省, July 2018 heavy rains) |
| F3 | A garden can become a candidate nature-coexistence site (自然共生サイト), and the prefecture is told about it. | `ev.midori.5.1`, `ev.midori.5.2`, `survey.site` | How 自然共生サイト certification works (it is run by the Ministry of the Environment), and who applies. Likely needs rewording: the ministry certifies, not the prefecture. | Corrected in the game on 12 Nov 2026 (see `docs/village-notebook.md`) |
| F4 | Genji firefly larvae live in the stream bed and eat snails; mud from a slope harms them. | `ev.midori.4.3`, `ev.midori.4.7` | Same as C23. | Checked 13 Nov 2026: same as C23 |
| F5 | At kaibori, bass and bluegill are taken out; crucian carp and loaches go back. | `ev.kuma.5.2` | Same as B11. | Standard knowledge, not looked up (13 Nov 2026): bass and bluegill are designated invasive species; low risk |
| F6 | Floating panels shade the water: less sun means fewer water plants, insects and fish; the shallow edge is where young fish hide. | `ev.kuma.3.3`, `ev.kuma.3.r1`, `ev.kuma.3.r2` | What is known about floating solar and pond ecology, and whether the shallow-edge claim is fair. | Checked 13 Nov 2026: 農林水産省 says the effects of floating solar on ponds are still being studied; as Kuma-san's worry it is fair |
| F7 | The hottest summers ever measured come one after another. | `ev.rin.1.2`, `ev.rin.1.3` | Same as B16, with Japan Meteorological Agency records. | Standard knowledge, not looked up (13 Nov 2026): record summers in Japan in recent years (気象庁); low risk |
| F8 | A hedge takes about five years to grow into a proper hedge. | `ev.rin.4.4` | Typical growing time for a native hedge in Japan. | Standard knowledge, not looked up (13 Nov 2026): a few years for a hedge to close; low risk |
| F9 | Some solar parks are built on gravel and sprayed with weed killer every year. | `ev.midori.2.2`, `ev.midori.2.3` | Same as B15. | Standard knowledge, not looked up (13 Nov 2026): the practice exists; the line doesn't say it is the rule; low risk |
| F10 | The water in a seedling paddy is read by depth, and a pond keeper reads a water gauge at dawn. | `kuma.req2.ask.2`, `kuma.req2.read` | That irrigation ponds have simple water gauges, read by the keeper. The number (1.2 m) is fiction. | Standard knowledge, not looked up (13 Nov 2026); the number is fiction |
| F11 | The circular board (回覧板) goes from house to house; each household stamps it. | `ev.oda.1.2`, `ev.oda.1.3` | The custom (see also B-rows on village customs). | Standard knowledge, not looked up (13 Nov 2026): 回覧板 and stamps; low risk |
| F12 | Calligraphy at New Year (書き初め). | `ev.oda.5.4`, `keep.calligraphy.text` | The custom and its timing (usually 2 January). | Standard knowledge, not looked up (13 Nov 2026): 書き初め, usually on 2 January; low risk |
| F13 | Solar panels make a little less power when they get very hot. | `kurokawa.chat.summer` (Milestone 3.2) | The temperature effect on panel output. | Standard knowledge, not looked up (13 Nov 2026): panel output falls as the cells get hotter; low risk |
| F14 | Rice paddies can hold back rainwater for the houses below; swallows nest under eaves; red dragonflies come to the paddies in autumn. | `sato.chat.*`, `announce.news.*.y2`, `midori.chat.*` (Milestone 3.2) | Same as A9 and the C rows for the species. | Checked 13 Nov 2026: same as A9 and the C rows |

## D. Game rules that are not facts

These are simplifications the game needs, so they don't need checking as facts. They are listed so that a reviewer doesn't mistake them for real rules. If any text states one as a real-world fact, it should be reworded.

- All money amounts: panel and tile prices, the allowance, the lease, the gifts, the grant, power earnings.
- Power per panel, and the weather factors.
- The nature score and the "nature score 20, 25, 30, 60" thresholds.
- The farmland permit taking exactly 2 days.
- Typhoon wind always from the south, and hedges sheltering panels behind them.
- Rain running south on the slope, and ditches catching it.
- The citizen fund amounts by hearts.
- The meeting's "room warmth".
- The three meters and the endings.

## E. Village notebook entries planned for Milestone 3.2

*Researched on 12 November 2026: the texts and sources are in `docs/village-notebook.md`, reviewed and approved on 12 November 2026, and in the game since Milestone 3.2. E20 (goats) is replaced by "Meadows under panels" (approved on 12 November 2026).*

From `design.md` section 13. These texts don't exist in the game yet. Entries marked "Reviewed in Solar Commons" were researched for Solar Commons (`docs/policy-notebook.md` there). They will be shortened and must be checked again, because policy changes.

| # | Entry | Status in design 13 | What to check |
|---|---|---|---|
| E1 | Regional revitalisation cooperators | New | Programme facts (see B1). |
| E2 | Akiya banks | New | How akiya banks work. |
| E3 | Yui | New | See B4. |
| E4 | Nemawashi and the residents' association | New | See B3. |
| E5 | The resident briefing (説明会), required since April 2024 | Reviewed in Solar Commons | The rule and its date (see A6). |
| E6 | Farmland conversion (農地転用) | Reviewed in Solar Commons | See A3. |
| E7 | Agrivoltaics, shading under 30% from April 2027 | Reviewed in Solar Commons | See A1. |
| E8 | Forest development permit from 0.5 ha since April 2023 | Reviewed in Solar Commons | The size and date. |
| E9 | Local solar ordinances | Reviewed in Solar Commons | See A7. |
| E10 | Promotion zones | Reviewed in Solar Commons | See A5. |
| E11 | The end of FIT/FIP for new ground-mounted solar from fiscal year 2027 (rooftops keep support) | Reviewed in Solar Commons | See A4. The rooftop part too. |
| E12 | Citizen funds (市民出資) | Reviewed in Solar Commons | How citizen investment in renewable energy works. |
| E13 | Nature-coexistence sites and 30by30 | Reviewed in Solar Commons | The certification system. |
| E14 | Decommissioning reserve | Reviewed in Solar Commons | The rule. |
| E15 | Irrigation ponds and floating solar | New | See B12; floating solar on irrigation ponds in Japan. |
| E16 | Rice paddies as wetlands (medaka, frogs) | New | See C14. |
| E17 | Fireflies need clean streams | New | See C23. |
| E18 | Hedges and windbreaks (生垣・屋敷林) | New | Hedges and homestead woods as windbreaks. |
| E19 | Solar, batteries and evacuation shelters | New | See A8. |
| E20 | Grazing goats under panels | New | That goat grazing for weed control is practised. |
