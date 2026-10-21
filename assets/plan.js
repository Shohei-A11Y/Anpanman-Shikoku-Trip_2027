/* 行程のデータ（手で書いたもの）。調査データは trip-data.js にある。
   時刻は2026年10月時点のもの。2027年のダイヤは、まだ発表されていない。
   stop：止まる所／move：移動／at：着く時刻／dep：出る時刻／est：目安の時刻（ごろ）*/
window.PLAN = {
  start: '2027-10-15T07:14:00+09:00',
  end: '2027-10-18T17:37:00+09:00',
  days: [
    {
      n: 1, date: '2027-10-15', dd: '15', dow: '金', color: 'd1', theme: '移動日',
      title: '新大村から高知へ。南風7号に乗る',
      route: '新大村 → 岡山 → 高知',
      items: [
        { k: 'stop', dep: '07:14', name: '新大村', type: 'station', kind: 'start' },
        { k: 'move', min: 14, mode: 'shinkansen', text: '西九州新幹線 かもめ4号', ride: 'kamome4' },
        { k: 'stop', at: '07:28', dep: '07:31', name: '武雄温泉', type: 'station', minor: 1, note: '同じホームの向かい側に乗り換え（約3分）' },
        { k: 'move', min: 65, mode: 'train', text: 'JR特急 リレーかもめ4号', ride: 'relay4' },
        { k: 'stop', at: '08:36', dep: '08:53', name: '博多', type: 'station', note: '乗り換え17分。エレベーターの経路はわからないので、駅員さんに聞くと安心' },
        { k: 'move', min: 99, mode: 'shinkansen', text: '山陽新幹線 みずほ602号', ride: 'mizuho602' },
        { k: 'stop', at: '10:32', dep: '11:05', name: '岡山', type: 'station', note: '乗り換え33分。おやつや飲み物を買う時間' },
        { k: 'move', min: 154, mode: 'train', text: 'アンパンマン列車 南風7号', ride: 'nanpu7', hot: 1 },
        { k: 'stop', at: '13:39', name: '高知駅', type: 'spot', spot: 'kochi-station', note: 'ホームから改札へはエレベーター' },
        { k: 'move', min: 10, mode: 'walk', text: '徒歩', detail: '約550m。宿の無料送迎もある（予約時に申し込み。お迎えは11:00〜18:00）。ベビーカーだと少し長くかかる。', sure: '推測' },
        { k: 'stop', est: '午後', name: '土佐御苑', type: 'hotel', stay: 'tosa', note: '荷物を預けて身軽に。チェックインは15:00〜' },
        {
          k: 'move', min: null, mode: 'tram', text: '高知城へ（路面電車・バス・徒歩）',
          detail: '宿から高知城までの所要時間は、わからない。高知駅からの目安は、下のとおり。',
          alts: [['tram', 18, '路面電車2本（はりまや橋で乗りかえ）＋徒歩約200m'], ['bus', 13, 'バス約10分＋徒歩約200m'], ['walk', 30, '徒歩 約1.4km']]
        },
        { k: 'stop', est: '14:30', name: '高知城', type: 'spot', spot: 'kochi-castle', dep: '16:30', note: '天守は急な階段。抱っこで上る' },
        { k: 'move', min: 5, mode: 'walk', text: '徒歩', detail: '約250m', sure: '推測' },
        { k: 'stop', est: '16:30', name: 'ひろめ市場', type: 'spot', spot: 'hirome-market', dep: '18:00', note: '夕ごはん。かつおのたたき' },
        { k: 'stop', name: '土佐御苑', type: 'hotel', stay: 'tosa', kind: 'goal', note: 'ゆっくり休む' }
      ]
    },
    {
      n: 2, date: '2027-10-16', dd: '16', dow: '土', color: 'd2', theme: 'アンパンマン',
      title: 'レンタカーでアンパンマンミュージアムへ',
      route: '高知 → 香美市 → のいち',
      items: [
        { k: 'stop', name: '土佐御苑', type: 'hotel', stay: 'tosa', kind: 'start', note: '朝食は7:00から' },
        { k: 'move', min: 10, mode: 'walk', text: '徒歩', detail: '7〜10分（推測）', sure: '推測' },
        { k: 'stop', at: '08:00', name: 'トヨタレンタカー高知駅前店', type: 'car', stay: 'car', note: 'チャイルドシート2台を、車と一緒に予約しておく' },
        { k: 'move', min: 60, mode: 'car', text: '車（約30km）', detail: '開館の9:30に間に合うよう、余裕を見て早めに出る', sure: '確定' },
        { k: 'stop', at: '09:30', dep: '11:30', name: 'アンパンマンミュージアム', type: 'spot', spot: 'anpanman-museum', note: '日時指定の予約が必要。ベビーカーは車に置いて、抱っこひもで' },
        { k: 'move', min: 2, mode: 'walk', text: '徒歩', detail: '約100m', sure: '推測' },
        { k: 'stop', at: '11:30', dep: '12:30', name: '韮生の里（道の駅）', type: 'spot', spot: 'niro-no-sato', note: '昼ごはん' },
        { k: 'move', min: 30, mode: 'car', text: '車（約15km）', sure: '推測' },
        { k: 'stop', at: '13:00', dep: '16:00', name: 'のいち動物公園', type: 'spot', spot: 'noichi-zoo', note: '入園は16:00まで' },
        { k: 'move', min: 45, mode: 'car', text: '車（約20km）', sure: '推測' },
        { k: 'stop', est: '夜', name: '高知駅前でレンタカーを返す', type: 'car', stay: 'car', note: '店は20:00まで。給油は、近くの高知駅前SS（19:00まで）' },
        { k: 'stop', name: '土佐御苑', type: 'hotel', stay: 'tosa', kind: 'goal' }
      ]
    },
    {
      n: 3, date: '2027-10-17', dd: '17', dow: '日', color: 'd3', theme: 'トロッコ',
      title: '日曜市のあと、琴平からトロッコで岡山へ',
      route: '高知 → 琴平 → 岡山',
      items: [
        { k: 'stop', name: '土佐御苑', type: 'hotel', stay: 'tosa', kind: 'start' },
        { k: 'move', min: 7, mode: 'walk', text: '徒歩', detail: '約350〜500m', sure: '推測' },
        { k: 'stop', at: '07:30', dep: '09:00', name: '日曜市', type: 'spot', spot: 'nichiyouichi', note: '午前中に回る。お店がそろうのは8時ごろから' },
        { k: 'move', min: null, mode: 'walk', text: '宿へ戻って荷物をとる', detail: '宿の無料送迎で高知駅へ行く手もある（お送りは7:00〜10:00。予約時に申し込み）' },
        { k: 'stop', est: '09:30', name: '土佐御苑', type: 'hotel', stay: 'tosa', note: 'チェックアウトは10:00まで' },
        { k: 'move', min: 10, mode: 'walk', text: '徒歩（または宿の送迎）', sure: '推測' },
        { k: 'stop', dep: '10:13', name: '高知駅', type: 'station', spot: 'kochi-station' },
        { k: 'move', min: 94, mode: 'train', text: 'JR特急 南風10号', detail: '2026年10月の号数では、10号はアンパンマン列車の対象外。車両は変わることがあるので、乗る日の時刻表で確認する。', ride: 'nanpu10' },
        { k: 'stop', at: '11:47', name: '琴平駅', type: 'spot', spot: 'kotohira-station', note: 'エレベーターはない。南風10号は2番のりば（2026年の時刻表）で、改札と同じ高さの側。階段なしで出られる見込み【推測】。トロッコ4号ののりばは、わからない' },
        {
          k: 'move', min: 10, mode: 'walk', text: '徒歩', detail: 'うどん店まで、駅から約500〜700m。',
          alts: [['walk', 9, '宗家金毘羅饂飩 狸屋（約500m）'], ['walk', 10, 'うどん茶屋 てんてこ舞（約550m）'], ['walk', 12, 'こんぴらうどん 参道店（約700m）']]
        },
        { k: 'stop', at: '12:00', dep: '12:45', name: 'うどん（3店から選ぶ）', type: 'food', spots: ['kotohira-tanukiya', 'kotohira-tentekomai', 'kotohira-konpira-udon'], note: '座敷が空いていれば座敷へ' },
        { k: 'stop', est: '12:30', name: '金刀比羅宮の参道', type: 'spot', spot: 'kotohira-gu-sando', note: '石段の手前まで。785段の石段は上らない' },
        { k: 'move', min: null, mode: 'walk', text: '駅へ戻る', detail: '13:16発に間に合うよう、13:00ごろには駅へ向かう。時間はまだ決まっていない。' },
        { k: 'stop', dep: '13:16', name: '琴平駅', type: 'station', spot: 'kotohira-station' },
        { k: 'move', min: 98, mode: 'train', text: 'アンパンマントロッコ4号', detail: '全席グリーン車。4人で1つのテーブル席。ベビーカー置き場あり（数に限りあり）。運転日は予想。', ride: 'torokko4', hot: 1 },
        { k: 'stop', at: '14:54', name: '岡山駅', type: 'station', spot: 'okayama-station' },
        { k: 'move', min: 12, mode: 'walk', text: '徒歩（駅の東口から）', detail: '約700m', sure: '推測' },
        { k: 'stop', name: 'ピュアリティまきび', type: 'hotel', stay: 'makibi', kind: 'goal', note: 'チェックインは15:00〜' }
      ]
    },
    {
      n: 4, date: '2027-10-18', dd: '18', dow: '月', color: 'd4', theme: '帰宅',
      title: '岡山でゆっくりして、新大村へ帰る',
      route: '岡山 → 新大村',
      items: [
        { k: 'stop', name: 'ピュアリティまきび', type: 'hotel', stay: 'makibi', kind: 'start', note: 'チェックアウト後の荷物あずかりは、わからない。電話で聞く' },
        { k: 'choice', text: 'A　雨でもOK' },
        { k: 'move', min: 10, mode: 'walk', text: '徒歩', detail: '約600m', sure: '推測' },
        { k: 'stop', at: '10:00', dep: '13:15', name: 'イオンモール岡山', type: 'spot', spot: 'aeon-mall-okayama', tag: '雨でもOK', note: '室内の遊び場や授乳室がある（場所はわからない）' },
        { k: 'choice', text: 'B　晴れたら（Aのかわり）' },
        { k: 'move', min: 10, mode: 'car', text: '車（またはバス・徒歩）', detail: '徒歩なら約40分（約2.3km）。', alts: [['bus', 25, '徒歩約700m＋バス'], ['walk', 40, '徒歩 約2.3km']], sure: '推測' },
        { k: 'stop', at: '09:30', dep: '11:30', name: '岡山後楽園', type: 'spot', spot: 'okayama-korakuen', tag: '晴れたら', note: '8:00〜17:00、年中無休。ベビーカー貸出あり' },
        { k: 'move', min: 7, mode: 'walk', text: '岡山駅へ', detail: 'イオンモールからは、岡山駅の地下改札口まで約450m。後楽園からは、バスで岡山駅へ約10〜15分。', sure: '推測' },
        { k: 'stop', at: '13:15', dep: '14:11', name: '岡山駅', type: 'station', spot: 'okayama-station', note: '帰りの荷物と、お土産' },
        { k: 'move', min: 108, mode: 'shinkansen', text: '山陽新幹線 さくら757号', ride: 'sakura757' },
        { k: 'stop', at: '15:59', dep: '16:16', name: '博多', type: 'station', note: '乗り換え17分。午前ののぞみ13号は9分しかなく、ベビーカー連れには厳しい' },
        { k: 'move', min: 81, mode: 'train', text: 'リレーかもめ43号 → 西九州新幹線', detail: '武雄温泉で、同じホームの向かい側に乗り換える。', ride: 'relay43' },
        { k: 'stop', at: '17:37', name: '新大村', type: 'station', kind: 'goal', note: 'おつかれさま' }
      ]
    }
  ],
  rides: [
    { id: 'kamome4', day: 1, name: 'かもめ4号', kind: '西九州新幹線', from: '新大村', to: '武雄温泉', dep: '07:14', arr: '07:28', note: '武雄温泉で、同じホームの向かい側に乗り換え（約3分）。' },
    { id: 'relay4', day: 1, name: 'リレーかもめ4号', kind: 'JR特急（在来線）', from: '武雄温泉', to: '博多', dep: '07:31', arr: '08:36', note: '博多で17分の乗り換え。' },
    { id: 'mizuho602', day: 1, name: 'みずほ602号', kind: '山陽・九州新幹線', from: '博多', to: '岡山', dep: '08:53', arr: '10:32', note: '2027年7月から、のぞみ・みずほの指定席が約500円上がる見込み（家族4人の合計）。' },
    { id: 'nanpu7', day: 1, name: '南風7号（アンパンマン列車）', kind: 'JR特急（土讃線）', from: '岡山', to: '高知', dep: '11:05', arr: '13:39', hot: 1, note: '1号車のアンパンマンシートは24席だけ。乗る日の1か月前の10:00から予約。車内ではベビーカーをたたんで、座席の近くに置く。南風7号は「Bパターン」のアンパンマン列車。「あかい」と「きいろい」は1日おきに入れかわる。日によって、一部の車両がふつうの車両になったり、アンパンマンシートの車両がつかなかったりする。その月の予定は、2か月前の月末から、アンパンマン列車の公式サイトの運転カレンダーに出る【確定】。', alt: '朝が早すぎるとき：新大村 11:00発 → 岡山 15:05発 南風15号（アンパンマン列車）→ 高知 17:41着。' },
    { id: 'nanpu10', day: 3, name: '南風10号', kind: 'JR特急（土讃線）', from: '高知', to: '琴平', dep: '10:13', arr: '11:47', note: '2026年10月の号数では、アンパンマン列車の対象外。', alt: 'もう1回アンパンマン列車に乗るなら：日曜市をあきらめて、高知 08:01発 南風6号 → 琴平 09:35着。' },
    { id: 'torokko4', day: 3, name: 'アンパンマントロッコ4号', kind: '瀬戸大橋アンパンマントロッコ', from: '琴平', to: '岡山', dep: '13:16', arr: '14:54', hot: 1, note: '全席グリーン車（48席）。4人で1つのテーブル席。買うのは2号車の席で、トロッコ区間は1号車の同じ番号の席も使える。2号車にベビーカー置き場・多目的室・洋式トイレ、1号車に記念撮影スペースとあそびスペース【確定】。2026年秋の時刻：琴平13:16発 → 善通寺13:25 → 多度津13:34 → 丸亀13:40 → 宇多津13:45 → 児島14:23発 → 岡山14:54着。トロッコ車両に乗れるのは琴平〜児島。過去の10月は土日と祝日に運転（2026年10月は3・4・10・11・12・17・18・24・25・31日）。2027年の運転日は、6月中旬〜下旬に発表される見込み【予想】。' },
    { id: 'sakura757', day: 4, name: 'さくら757号', kind: '山陽・九州新幹線', from: '岡山', to: '博多', dep: '14:11', arr: '15:59', note: '博多で17分の乗り換え。' },
    { id: 'relay43', day: 4, name: 'リレーかもめ43号 ＋ 西九州新幹線', kind: 'JR特急＋新幹線', from: '博多', to: '新大村', dep: '16:16', arr: '17:37', note: '武雄温泉で、同じホームの向かい側に乗り換え。' }
  ],
  fare: [
    ['子供の運賃', '1〜5歳は「幼児」。席を使わなければ、大人1人につき2人まで無料。今回は2人とも席を取るので、2人分の子供料金（大人の半額）がかかる。'],
    ['トロッコ', 'グリーン券は、子供も大人と同額（1,260円）。'],
    ['予約の発売', '乗る日の1か月前の10:00から。初日（10/15）の列車は、9/15の10:00。'],
    ['南風の席', '2027年春から、特急「南風」は全席指定席になる（自由席なし。JR四国・JR西日本の2026年3月19日の発表）。乗る列車はすべて指定席を予約する。始まる日は、まだ決まっていない【確定】。'],
    ['ベビーカー', '新幹線は、予約なしで持ち込める。南風とトロッコでは、たたんで座席の近くに置く。']
  ],
  rainTitles: { 1: '高知', 2: '高知・香美市', 3: '高知・琴平', 4: '岡山' }
};
