# The village notebook (村のノート): texts for review

**Status: researched, reviewed and approved on 12 November 2026; in the game since Milestone 3.2, with the five line corrections below.** After your review, the texts move into `lang/en.js` and `lang/ja.js` (text codes `nb.<id>.title` and `nb.<id>.text`). This file stays as the record of sources, as `docs/policy-notebook.md` does in Solar Commons.

The notebook is planned in `design.md` section 13. Each entry is one or two sentences about the real world, and unlocks at a moment in the game. Unlocked entries can also be read from the title screen.

- **Entries 5–14** were researched and approved for Solar Commons (`C:\dev\solar-commons\docs\policy-notebook.md`, read only). Here they are shortened, with the same sources.
- **Entries 1–4 and 15–20** are new. Facts marked *(secondary)* come from news, law firm or general pages, not the official source itself.
- Each entry ends with **Please check**, the points I'm least sure about.
- After the entries: the results of the energy-policy fact check and the four flagged lines, and the game lines I suggest correcting.

---

## 1. Regional revitalisation cooperators (地域おこし協力隊) `cooperator`

**Unlocks:** at the start of the game.

- EN: Since 2009, people from the cities can move to a rural town for about one to three years and work for the community there, with the national government covering the costs. In fiscal year 2024, 7,910 cooperators worked in about 1,170 towns and villages.
- JA: 2009年から、都市に住む人が地方の市町村に移り住み、1〜3年ほど地域のために働く制度があります。費用は国が支えています。2024年度には、約1,170の自治体で7,910人が活動しました。

**Sources**
- 総務省, 地域おこし協力隊 資料（隊員数 7,910人、取組自治体 1,176団体、活動期間 概ね1年以上3年以下）: https://www.soumu.go.jp/main_content/001069410.pdf
- 総務省, 資料（令和7年度 8,196人、令和8年度の目標 1万人）: https://www.soumu.go.jp/main_content/001092493.pdf

**Please check:** the start year 2009 is from my own knowledge (the programme began in fiscal year 2009), not from the sources above. Since fiscal year 2026, a special case allows up to 5 years; the text says "about one to three years".

---

## 2. Akiya banks (空き家バンク) `akiya`

**Unlocks:** at the start of the game.

- EN: Many towns list empty houses for sale or rent in an "akiya bank" to attract new residents. In 2023, Japan had about 9 million empty homes, 13.8% of all homes, the most ever recorded.
- JA: 多くの市町村は、空き家を「空き家バンク」に登録して、売ったり貸したりできるようにし、新しい住民を呼びこんでいます。2023年、日本の空き家は約900万戸で、住宅全体の13.8%と過去最多になりました。

**Sources**
- 国土交通省, 資料（全国版空き家・空き地バンク）: https://www.mlit.go.jp/tochi_fudousan_kensetsugyo/const/content/001750045.pdf
- データ・マックス, 空き家数が過去最高の900万戸 *(secondary, citing 総務省 令和5年住宅・土地統計調査: 899万戸、13.8%)*: https://data-max.co.jp/article/70863

**Please check:** the 899万戸 / 13.8% figures against the original 総務省 survey (I found them only in secondary articles).

---

## 3. Yui (結): helping each other `yui`

**Unlocks:** at your first work day.

- EN: Yui is the old custom of households helping each other in turn with big jobs, such as rice planting or re-thatching a roof. In Shirakawa-gō, 100 to 200 people once worked on one roof at the same time, and every gift of work was written down in a ledger, the oldest from 1792.
- JA: 「結（ゆい）」は、田植えや屋根のふき替えのような大きな仕事を、家どうしが順番に助け合う昔からのしきたりです。白川郷では、ひとつの屋根に100〜200人が同時に上がって作業することもあり、手伝いは「結帳」に記録されました。残っている最も古い結帳は1792年のものです。

**Sources**
- 国土交通省 観光庁 多言語解説文データベース, 結（ゆい）: https://www.mlit.go.jp/tagengo-db/R2-00129.html
- 国土交通省 多言語解説文（白川郷）: https://www.mlit.go.jp/tagengo-db/common/001781147.pdf

**Please check:** that yui also covered rice planting (one source is a wiki-style page; the MLIT texts focus on roofs).

---

## 4. Nemawashi and the residents' association (根回し・自治会) `nemawashi`

**Unlocks:** when Mr. Oda teaches you nemawashi (his 3-heart event).

- EN: Nemawashi first meant digging around a tree and cutting some of its roots months before moving it, so it would take root well in its new place. Later it came to mean talking to everyone quietly before a decision. Japan has about 296,000 neighbourhood associations such as jichikai, which run local life from festivals to circular boards.
- JA: 「根回し」は、もともと木を移植する何か月も前に、根のまわりを掘って根の一部を切り、新しい場所で根づきやすくする作業のことでした。のちに、物事を決める前に関係者と話しておくことを指すようになりました。日本には、自治会や町内会などの地縁団体が約29万6千あり、祭りから回覧板まで地域の暮らしを支えています。

**Sources**
- 愛媛県, 樹木の移植（根回し：移植の半年から1年前）: https://www.pref.ehime.jp/uploaded/attachment/74812.pdf
- weblio 辞書, 根回し（植木の意味と比喩の意味）*(secondary)*: https://www.weblio.jp/content/%E6%A0%B9%E5%9B%9E%E3%81%97
- 総務省, 地縁による団体の認可事務の状況等に関する調査結果（2023年4月1日時点 295,838団体）: https://www.soumu.go.jp/main_content/000938670.pdf

**Please check:** the 295,838 figure counts the neighbourhood groups that municipalities know of (自治会 44%, 町内会 23%, and others); it may not include every group. "From festivals to circular boards" is my own summary.

---

## 5. The resident briefing (住民説明会) `briefing` *(from Solar Commons)*

**Unlocks:** at your first town meeting.

- EN: Since April 2024, solar projects must inform nearby residents before applying for fixed-price support. Projects of 50 kW and more, and projects in areas where the risk to the surroundings is high, must hold a briefing.
- JA: 2024年4月から、太陽光発電の事業は、固定価格の支援を申請する前に、周辺の住民に知らせることが義務になりました。50kW以上の事業や、周辺への影響が大きい区域の事業は、説明会を開く必要があります。

**Sources:** as in Solar Commons entry 1 (資源エネルギー庁 notice of 13 Aug 2024; 横浜市; law firm notes).

**Please check:** as in Solar Commons (the "high-risk areas" and the 50 kW line).

---

## 6. Farmland conversion (農地転用) `farmland` *(from Solar Commons)*

**Unlocks:** when you first plan on Fumiko-san's field.

- EN: Using farmland for anything other than farming needs a permit under the Farmland Act, usually from the prefecture. The best farmland is protected in principle, and an abandoned field still counts as farmland unless the agricultural committee decides it can no longer be farmed.
- JA: 農地を農業以外に使うには、農地法に基づく許可が必要で、多くは都道府県が許可します。優良な農地は原則として転用できず、耕作放棄地も、農業委員会がもう農地として使えないと判断しない限り、農地として扱われます。

**Sources:** as in Solar Commons entry 2 (農林水産省 materials on the farmland conversion permit system).

---

## 7. Agrivoltaics (営農型太陽光発電) `agri` *(from Solar Commons)*

**Unlocks:** when you first plan on Gen-san's paddy.

- EN: Panels can stand on posts above fields that are still farmed. Only the land under the posts gets a temporary permit, the harvest must be reported every year, and from April 2027 the shade should stay under 30% in principle.
- JA: 耕作を続ける農地の上に、支柱でパネルを立てることができます。支柱の部分だけに一時的な転用許可が出て、毎年の収穫の報告が必要です。2027年4月からは、遮光率を原則30％未満とすることになっています。

**Sources:** as in Solar Commons entry 3 (農林水産省 guideline and materials; SOLAR JOURNAL and PwC on the 2027 framework).

**Please check:** as in Solar Commons, the 2027 framework is known mostly from secondary sources; add the official notice when it is published.

---

## 8. Forest development permit (林地開発許可) `forest` *(from Solar Commons)*

**Unlocks:** when Mr. Kurokawa first offers to build on the forest slope.

- EN: Clearing forest needs a permit from the prefecture under the Forest Act, with drains and retention ponds against landslides and floods. For solar, the permit has been needed from 0.5 hectares (instead of 1) since April 2023.
- JA: 森林を開発するには、森林法に基づく都道府県の許可が必要で、土砂災害や水害を防ぐ排水施設や調整池が求められます。太陽光発電の場合、2023年4月から、許可が必要な面積が1ha超から0.5ha超に引き下げられました。

**Sources:** as in Solar Commons entry 4 (農林水産省 中国四国農政局; 資源エネルギー庁; 愛知県).

---

## 9. Local solar ordinances (太陽光発電に関する条例) `ordinance` *(from Solar Commons)*

**Unlocks:** when the town passes its ordinance after the mudflow, or when Ms. Sato tells you about the landslide (her 2-heart event).

- EN: Many prefectures and towns have made their own rules for solar parks, often after landslides or conflicts with residents. Yamanashi Prefecture's ordinance of 2021, for example, in principle bans new solar parks in forests and landslide-risk areas.
- JA: 土砂災害や住民とのトラブルをきっかけに、多くの都道府県や市町村が太陽光発電の独自の条例を定めています。たとえば山梨県の条例（2021年）は、森林や土砂災害のおそれがある区域への新規設置を、原則として禁止しています。

**Sources:** as in Solar Commons entry 5 (山梨県 ordinance; 経済産業省 地域共生WG).

---

## 10. Promotion zones (促進区域) `promo` *(from Solar Commons)*

**Unlocks:** at the zoning workshop.

- EN: Since April 2022, towns can mark promotion zones for renewables together with local people, leaving out places such as nature reserves. Projects certified there must benefit the community and the environment, and can handle several permits in one procedure.
- JA: 2022年4月から、市町村は地域の人たちと話し合い、自然保護区などを除いて、再エネを進める「促進区域」を決められるようになりました。そこで認定された事業は、地域や環境への貢献が求められ、いくつもの許可の手続きをまとめて行えます。

**Sources:** as in Solar Commons entry 6 (環境省, 地域脱炭素化促進事業制度).

---

## 11. The end of fixed-price support for ground-mounted solar (FIT・FIP) `fitfip` *(from Solar Commons)*

**Unlocks:** at Hiro's rooftop event (his 3-heart event) or at the zoning workshop.

- EN: From fiscal year 2027, new ground-mounted solar of 10 kW and more no longer gets fixed-price support (FIT or FIP), while rooftop solar keeps it. Continued support for a few cases, such as certified projects in promotion zones, is still being discussed (as of November 2026).
- JA: 2027年度から、10kW以上の新しい地上設置の太陽光発電は、固定価格の支援（FIT・FIP）を受けられなくなります。屋根に設置する太陽光は、支援が続きます。促進区域で認定された事業など、一部については支援の継続が検討されています（2026年11月時点）。

**Sources:** as in Solar Commons entry 7 (調達価格等算定委員会 opinion of 5 Feb 2026; ITmedia; 環境ビジネス; cycle-tank).

**Please check:** the entry most likely to change; update after the decision expected around January 2027.

---

## 12. Citizen funds (市民出資) `fund` *(from Solar Commons)*

**Unlocks:** when you open your first citizen fund.

- EN: Many community energy projects in Japan are funded by local residents. In Ikoma (Nara), for example, a citizens' solar plant was paid for entirely by local investors, so its profits stay in the town.
- JA: 日本の地域エネルギー事業の多くは、住民の出資で資金を集めています。たとえば奈良県生駒市では、市民共同発電所を全額市民の出資でつくり、利益が地域に残るようにしています。

**Sources:** as in Solar Commons entry 10 (環境省 グッドライフアワード report on Ikoma; 西城戸誠, 法政大学).

---

## 13. Nature-coexistence sites and 30by30 (自然共生サイト) `natureSite` *(from Solar Commons, updated)*

**Unlocks:** when one of your gardens scores 60 or more in Midori's survey, or at Midori's 5-heart event.

- EN: Since 2023, Japan certifies places where people look after nature as "nature-coexistence sites". Since April 2025 this is based on a law, the national government certifies the plans, and restoring nature on neglected land counts too. The sites help reach the goal of protecting 30% of land and sea by 2030 (30by30).
- JA: 2023年から、人の手で自然が守られている場所が「自然共生サイト」として認定されています。2025年4月からは法律に基づく制度になり、国が計画を認定し、管理されなくなった土地で自然を回復させる活動も対象になりました。これらの場所は、2030年までに陸と海の30%を保全する目標（30by30）に役立ちます。

**Sources**
- 環境省, 資料: https://www.env.go.jp/content/000384044.pdf
- 林野庁, 地域生物多様性増進法（施行 2025年4月1日、主務大臣: 環境・農林水産・国土交通大臣）: https://www.rinya.maff.go.jp/j/sin_riyou/tayousei/zoushinhou.html
- 環境省, 認定結果の発表（2026年3月、合計569か所）: https://www.env.go.jp/press/press_03222.html

---

## 14. Decommissioning reserve (廃棄等費用積立制度) `decommission` *(from Solar Commons)*

**Unlocks:** on the first day one of your gardens makes power.

- EN: Since July 2022, solar projects of 10 kW and more under fixed-price support must save for taking their panels down at the end: the money is deducted from their income during the last 10 years of support.
- JA: 2022年7月から、固定価格の支援を受ける10kW以上の太陽光発電は、運転を終えたあとの撤去の費用を積み立てることが義務になりました。支援期間の最後の10年間に、売電収入から差し引かれます。

**Sources:** as in Solar Commons entry 9 (東京電力パワーグリッド; 九州電力; 経済産業省 WG).

---

## 15. Irrigation ponds and floating solar (ため池と水上太陽光) `tameike`

**Unlocks:** at Kuma-san's 3-heart event (the evening by the pond).

- EN: Japan has about 150,000 irrigation ponds (tameike), half of them around the Seto Inland Sea, and many were dug in the Edo period or earlier. Floating panels are being tried on some of them; the agriculture ministry has published guidance, and the effects on water and wildlife are still being studied.
- JA: 日本には約15万か所のため池があり、その約半分が瀬戸内地域にあります。多くは江戸時代かそれより前につくられました。一部のため池では水上太陽光発電が試されており、農林水産省が手引きを出していますが、水や生きものへの影響はまだ調べられているところです。

**Sources**
- 農林水産省, ため池とは（令和8年版、約15万か所、瀬戸内に約5割）: https://www.maff.go.jp/j/nousin/bousai/bousai_saigai/b_tameike/tameiketoha_R8.pdf
- 総務省, ため池の防災・減災対策に関する調査（江戸時代以前の築造が多い）: https://www.soumu.go.jp/main_content/000953730.pdf
- 農林水産省, 農業用ため池における水上太陽光発電の環境影響調査（参考図書）: https://www.maff.go.jp/j/nousin/noukan/eikyou_hyouka/taiyoukou.html

**Please check:** "half of them around the Seto Inland Sea" — the MAFF summary says about 50% are in the Setouchi region; the exact definition of the region may matter.

---

## 16. Rice paddies as wetlands (田んぼの生きもの) `paddy`

**Unlocks:** when you first see a species of the paddies (the rice fish, a frog or a dragonfly at the paddies) in your diary.

- EN: Flooded rice paddies work like the wetlands of old floodplains, and many frogs, dragonflies and fish live in them. The rice fish (medaka) became an endangered species after concrete channels, drained fields and invasive fish made its home scarce.
- JA: 水を張った田んぼは、昔の川辺の湿地のような役割を果たし、カエルやトンボ、魚がたくさん暮らしています。メダカは、水路のコンクリート化や乾田化、外来魚の影響で数が減り、絶滅危惧種になりました。

**Sources**
- 環境省, メダカ（絶滅危惧II類、減少の要因）: https://www.env.go.jp/nature/yasei/ex-situ/instance10.html
- 農林水産省, 田んぼの生きもの調査 資料: https://www.maff.go.jp/j/nousin/keityo/tanbo/attach/pdf/index-16.pdf
- 生物多様性センター, 資料（水田が氾濫原湿地の代わりになる）: https://www.biodic.go.jp/biodiversity/activity/policy/kyosei/23-5/files/2-4.pdf

**Please check:** the medaka is listed as Vulnerable (絶滅危惧II類) in the national Red List; "endangered species" in the English text is used in the everyday sense.

---

## 17. Fireflies need clean streams (ホタルと清流) `firefly`

**Unlocks:** at the firefly evening, or when the Genji firefly enters your diary.

- EN: Genji firefly larvae live in clean, oxygen-rich streams and feed mainly on kawanina snails, so the number of snails decides how many fireflies there are. The adults need dark nights to find each other by their light, and releasing bought fireflies or snails can harm the local ones.
- JA: ゲンジボタルの幼虫は、酸素をたくさん含むきれいな川で暮らし、おもにカワニナという巻き貝を食べます。カワニナの数が、ホタルの数を左右します。成虫は光で相手を見つけるので暗い夜が必要で、買ってきたホタルやカワニナを放すと、その土地のホタルを乱してしまうことがあります。

**Sources**
- 環境省, 里地里山の保全活用 手法（ゲンジボタル）: https://www.env.go.jp/nature/satoyama/satonavi/method/pdf/2506.pdf
- 環境省, こどもページ（ホタルの放流は避ける）: https://www.env.go.jp/kids/water/hotaranger/intro/advice.html

---

## 18. Hedges and homestead woods (生け垣・屋敷林) `hedge`

**Unlocks:** after the typhoon.

- EN: Many farmhouses in Japan are surrounded by hedges or homestead woods against the wind. On the Tonami Plain in Toyama, scattered farmhouses each stand in their own grove (kainyo), which shelters them from the winter monsoon and the summer sun.
- JA: 日本の多くの農家は、風を防ぐ生け垣や屋敷林に囲まれています。富山県の砺波平野では、散らばって建つ家それぞれが屋敷林「カイニョ」に囲まれ、冬の季節風や夏の日差しから家を守っています。

**Sources**
- 環境省, 里地里山（砺波の散居村）: https://www.env.go.jp/nature/satoyama/16_toyama/no16-4.html
- 富山大学, 大西宏治（砺波平野の屋敷林）: https://toyama.repo.nii.ac.jp/record/12466/files/2008AsiaAfrica_01_Page043to047.pdf

**Please check:** whether you'd prefer an example nearer the game's imagined region; Izumo's tsuijimatsu (築地松) is another well-known one.

---

## 19. Solar and batteries at shelters (避難所の太陽光と蓄電池) `shelter`

**Unlocks:** on the typhoon night in the community hall.

- EN: The Ministry of the Environment helps towns put solar panels and batteries on public buildings that serve as evacuation shelters, so they keep the lights on in a blackout and cut emissions the rest of the year.
- JA: 環境省は、避難所になる公共施設に太陽光発電や蓄電池を入れる市町村を支援しています。停電のときも明かりを保ち、ふだんは温室効果ガスを減らすためです。

**Sources**
- 環境省, 地域レジリエンス・脱炭素化を同時実現する避難施設等への自立・分散型エネルギー設備等導入推進事業: https://www.env.go.jp/content/000424548.pdf
- 大阪府, 補助制度の案内（補助率の例）: https://www.pref.osaka.lg.jp/documents/1150/saiene.pdf

**Please check:** the programme's name and terms change from year to year; check the current fiscal year before release.

---

## 20. Meadows under panels (パネルの下の草地) `meadow` *(replaces the goats entry, approved on 12 November 2026)*

**Unlocks:** when you build your first meadow tile.

- EN: A survey of 15 solar parks in England (2024) found many bees and butterflies where flowers grow under and around the panels; the variety of flowers mattered most. Mown grass or gravel offers them little.
- JA: イギリスの15か所の太陽光発電所を調べた研究（2024年）では、パネルの下やまわりに花が咲く場所に、たくさんのハチやチョウが見られました。いちばん大切だったのは、花の種類の多さでした。刈りこんだ芝生や砂利には、ほとんど来ません。

**Sources**
- Blaydes et al. (2024), Ecological Solutions and Evidence (University of Reading repository): https://centaur.reading.ac.uk/115279/1/Ecol%20Sol%20and%20Evidence%20-%202024%20-%20Blaydes%20-%20On%E2%80%90site%20floral%20resources%20and%20surrounding%20landscape%20characteristics%20impact.pdf
- European Geosciences Union, news on the Lancaster University modelling study *(secondary)*: https://www.egu.eu/news/908/fields-of-solar-panels-could-serve-as-havens-for-butterflies-and-bumblebees/

**Please check:** the last sentence ("mown grass or gravel offers them little") is my summary of the comparison in these studies, not a quote. I found no Japanese field study; a Japanese example would be better if you know one.

---

## Fact check results (Milestone 3.2)

The energy-policy facts (section A of `docs/fact-check.md`), the policy facts from the heart events (F1, F3) and the four flagged lines.

| # | Result | Suggestion |
|---|---|---|
| A1 | Confirmed: shading under 30% in principle from April 2027 (Solar Commons entry 3, secondary sources). | Keep. |
| A2 | Confirmed in substance: the harvest is reported every year, and poor results bring guidance (Solar Commons entry 3). | Keep. |
| A3 | **Not right as written.** Agrivoltaics needs a temporary conversion permit (一時転用) for the land under the posts. | Correct the line (C1 below). |
| A4 | Confirmed as of November 2026; the decision is expected around January 2027. | Keep; check again in 2027. |
| A5 | Confirmed: certified projects in promotion zones can handle several permits in one procedure (one-stop), and must benefit the community. | Keep. |
| A6 | Confirmed: the company planning the project holds the briefing. | Keep. |
| A7 | Confirmed: many local ordinances restrict solar on slopes (for example Yamanashi 2021). | Keep. |
| A8 | Confirmed, but the support comes from the national government (Ministry of the Environment) to the towns. | Small correction (C2). |
| A9 | Confirmed: "paddy dams" (田んぼダム) hold rainwater with a board in the drain; about 99,000 ha in fiscal year 2024 *(secondary)*. Sources: 兵庫県 https://web.pref.hyogo.lg.jp/whk11/tanbo.html, 熊本県 https://www.pref.kumamoto.jp/soshiki/85/162369.html | Keep. |
| A10 | Confirmed: in the heavy rains of July 2018, solar parks reported 48 accidents, many from flooding and landslides (経済産業省 https://www.meti.go.jp/shingikai/sankoshin/hoan_shohi/denryoku_anzen/pdf/018_04_00.pdf). | Keep. |
| F1 | Confirmed: rooftop solar keeps support (Solar Commons entry 7). | Keep. |
| F3 | **Not right as written.** The national government (three ministers) certifies the sites, not the prefecture, and the land manager applies. | Correct the lines (C3). |
| B9 | **Not right as written** for all amazake: amazake made from rice koji has no alcohol, but amazake made from sake lees has a little (under 1% when sold as a soft drink) *(secondary)*. Source: 農林水産省 消費者の部屋 (found by search, not opened) https://www.maff.go.jp/j/heya/sodan/1201/a02.html | Correct the line (C4). |
| C20 | **Partly outdated.** The Daurian redstart is still mainly a winter visitor, but since about 2010 it has started breeding in parts of Honshu (Nagano, Gifu, Tottori and others). Source: 日本野鳥の会 Strix https://ftp.wbsj.org/nature/public/strix/38/strix38_10.pdf | Correct the line (C5). |

## Game lines I suggest correcting

These change only the words, not the rules.

| # | Text code | Now (EN) | Suggested (EN) | Suggested (JA) |
|---|---|---|---|---|
| C1 | `build.p.permit` | …Spaced panels over crops need no permit. | …Spaced panels over crops only need a quick temporary permit for their posts, and Ms. Sato arranges it at once. | …作物の上の間隔をあけたパネルは、支柱の部分の一時的な許可だけで済み、佐藤さんがすぐに手配してくれます。 |
| C2 | `shelter.lit.sato` | This is exactly why the town supports batteries at shelters. | This is exactly why the national government helps towns put batteries in shelters. | だからこそ国は、避難所に蓄電池を入れる町を支援しているんです。 |
| C3 | `survey.site`, `ev.midori.5.1`, `ev.midori.5.2` | …I'll write to the prefecture! / I sent my survey of your garden to the prefecture. It's a candidate… | …I'll help you write the application! / I helped you send in an application with my survey. Your garden is a candidate… The national government certifies these places. | …申請書を書くのを手伝いますね！ ／ 調査結果をつけて、申請を出すお手伝いをしました。あなたの庭は候補になりました。…認定するのは国です。 |
| C4 | `fest.hatsumode.hiro` | Warm and sweet, and no alcohol, so the kids can have some too. | Made from rice koji: warm and sweet, with no alcohol, so the kids can have some too. | 米こうじの甘酒だよ。あったかくて甘くて、アルコールなしだから子どもも飲めるよ。 |
| C5 | `species.redstart.fact` | A winter visitor from the continent. Each bird keeps… | Mostly a winter visitor from the continent, though some now nest in the mountains of Honshu. Each bird keeps… | 多くは冬に大陸からやってくる渡り鳥ですが、本州の山地で子育てをするものも出てきました。1羽ずつ… |

C1 keeps the game rule as it is (spaced panels over crops have no waiting days); only the text becomes accurate. A real temporary permit takes time, so if you prefer, spaced panels on Gen-san's paddy could also wait a few days for their permit. That would be a rule change, which I'd propose separately.
