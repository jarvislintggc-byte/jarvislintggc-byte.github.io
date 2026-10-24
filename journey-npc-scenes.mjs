// Fictional ambient game dialogue. These are not quotes from Jarvis's life.
const actor=(id,x,zh,en,lines,action='idle',mobileX=x)=>({id,x,mobileX,role:{'zh-Hant':zh,en},lines:lines.map(([zh,en])=>({'zh-Hant':zh,en})),action});
export const npcScenes=Object.freeze([
 [actor(1541239,44,'值勤老師','Duty teacher',[
  ['鐘聲不是背景音樂，聽到了就動起來！','That bell is not background music. Move!'],
  ['Jarvis，腦袋可以跑很快，人先回座位。','Jarvis, your mind can race. Your body needs to sit down.']]),
  actor(1012103,79,'同學','Classmate',[
  ['下課五分鐘，排隊四分鐘，真是精準管理。','Five minutes of break, four minutes in line. Peak efficiency.'],
  ['我有在聽，只是眼神先放學了。','I am listening. My eyes just left school early.']])],
 [actor(2040052,47,'圖書管理員','Librarian',[
  ['安靜。連你的內心小劇場也小聲一點。','Quiet. Even your inner monologue needs to whisper.'],
  ['單字不會自己走進腦袋，書先翻開。','Vocabulary will not walk into your brain. Open the book.']]),
  actor(1012104,80,'備考同學','Study partner',[
  ['背完這頁就休息。這句我已經講三頁了。','One more page, then a break. I said that three pages ago.'],
  ['我的單字量跟睡意，現在只有後者在成長。','My vocabulary and my drowsiness: only one is growing.']])],
 [actor(2111000,45,'語言老師','Language teacher',[
  ['文法可以重來，開口不要一直等完美。','You can fix your grammar. Stop waiting for perfect.'],
  ['今天也請用日文，點餐不准只用手指。','Japanese today, please. Pointing at the menu does not count.']]),
  actor(1012108,80,'語言學校學生','Language student',[
  ['我懂了！大概。可能。先點頭。','I get it! Probably. Maybe. Just nod for now.'],
  ['敬語一開，腦袋就開始讀取。','Honorifics detected. Brain buffering.']])],
 [actor(1002006,46,'咖啡店主廚','Cafe chef',[
  ['企畫很香，咖啡也要趁熱送。','That proposal smells good. So does coffee. Serve it hot.'],
  ['創意我收到了，桌上的杯子也順便收一下。','I got your ideas. Please get the cups off that table too.']],'work'),
  actor(1052004,80,'店長','Cafe manager',[
  ['點子先別加糖，成本表拿來。','Hold the sugar on that idea. Show me the costs.'],
  ['今天的隱藏任務：忙完還能笑。','Secret quest: still be smiling after the rush.']])],
 [actor(1011000,43,'商店街店主','Shopkeeper',[
  ['開店最早醒來的不是夢想，是房租。','The first thing up in a new shop is the rent.'],
  ['招牌掛好了，接下來靠你，不是靠風水。','The sign is up. The rest is on you.']]),
  actor(1012105,80,'鄰店老闆','Neighboring shop owner',[
  ['歡迎光臨！路過也可以，記得下次帶錢。','Welcome! Browsing is fine. Bring your wallet next time.'],
  ['人潮是人潮，成交是另一回事。','Foot traffic and sales are two different things.']])],
 [actor(2152006,44,'市場攤主','Market vendor',[
  ['昨天排隊的人，今天都跑去哪了？','Where did yesterday’s queue go?'],
  ['熱潮會退，冰箱裡的存貨不會自己退。','Hype fades. The stock in the fridge does not.']]),
  actor(2110002,80,'隔壁攤主','Next-door vendor',[
  ['別只盯著客人，帳本也看一下。','Watch the books as closely as the customers.'],
  ['今日特價：老闆的樂觀，免費。','Today’s special: the owner’s optimism. Free of charge.']])],
 [actor(2092001,44,'配送員','Courier',[
  ['路線改了就重算，站著不動不會到貨。','Route changed? Recalculate. Standing still delivers nothing.'],
  ['外送箱有保溫，人生轉彎沒有導航。','The delivery box has insulation. Life has no navigation.']]),
  actor(2152004,81,'待命廚師','Kitchen cook',[
  ['內用暫停，鍋子可沒說要休息。','Dine-in is closed. The stove did not ask for a break.'],
  ['訂單從哪來不重要，別讓它冷掉。','Wherever the order comes from, do not let it go cold.']],'work')],
 [actor(2110000,45,'維修技師','Repair technician',[
  ['先斷電！信心不能當絕緣手套。','Power off first! Confidence is not an insulating glove.'],
  ['線先插好，再來懷疑人生。','Plug the cable in before questioning your life.']],'work'),
  actor(2012017,81,'機械助手','Mechanical assistant',[
  ['零件很齊，少的是桌面空間。','All the parts are here. Desk space is missing.'],
  ['螺絲多一顆？先別急著說是備用。','One screw left over? Do not call it a spare yet.']])],
 [actor(2111007,44,'試賣攤主','Test-market seller',[
  ['先小量試賣，倉庫不是許願池。','Test a small batch. The warehouse is not a wishing well.'],
  ['這條支線沒過？至少別把存檔刪了。','Side quest failed? At least keep the save file.']]),
  actor(2152017,81,'路過商人','Passing trader',[
  ['有些學費沒收據，記得把教訓帶走。','Some tuition comes without a receipt. Keep the lesson.'],
  ['賣不動就換打法，別跟貨架深情對望。','Try another approach. Stop staring lovingly at the shelf.']])],
 [actor(1092000,45,'廚房主廚','Head chef',[
  ['品牌可以分身，爐子一次只能開這幾口。','Brands can multiply. Stove burners cannot.'],
  ['腦袋在開新品牌，手先把這鍋顧好！','Your brain is launching brands. Your hands need to watch this pot!']],'work'),
  actor(1082001,81,'取餐配送員','Pickup courier',[
  ['老闆，夢想可以慢慢煮，這單不能。','Boss, dreams can simmer. This order cannot.'],
  ['我在等餐，客人在等我，大家都很有耐心。大概。','I wait for food. The customer waits for me. Such patience. Probably.']])],
 [actor(2040050,44,'工作室技師','Studio technician',[
  ['規格先對清楚，別讓 RGB 掩蓋問題。','Check the specs first. RGB cannot hide a problem.'],
  ['又想升級？先確認瓶頸不是自己。','Another upgrade? Check that you are not the bottleneck.']],'work'),
  actor(2012018,81,'測試助手','Testing assistant',[
  ['能開機只是開始，穩定跑完才算數。','Booting is the beginning. Stability is the test.'],
  ['風扇很安靜，希望不是沒接電。','The fan is quiet. Hopefully it has power.']])],
 [actor(1002103,44,'碼頭船長','Harbor captain',[
  ['該靠岸就靠岸，船長也得看油量。','Dock when you need to. Even captains check the fuel.'],
  ['行李帶走就好，整間倉庫不用搬上船。','Bring your luggage. Leave the warehouse behind.']]),
  actor(1082101,80,'港口搬運員','Dock worker',[
  ['下一班要出發了，猶豫不能托運。','Next departure soon. Hesitation is not checked luggage.'],
  ['箱子有標方向，人有時候也需要。','Boxes have direction labels. People sometimes need them too.']])],
 [actor(2152011,45,'語言同學','Language classmate',[
  ['海景很美，作業不會被海浪沖走。','Lovely sea view. The waves will not wash your homework away.'],
  ['今天也用英文，連抱怨都算練習。','English today. Even complaining counts as practice.']]),
  actor(2152010,81,'海邊教練','Coastal coach',[
  ['太陽很熱，腦袋不要曬到當機。','The sun is hot. Keep your brain from overheating.'],
  ['先把防曬擦好，再來談乘風破浪。','Sunscreen first. Conquering waves comes later.']])],
 [actor(2152001,34,'教官','Drill instructor',[
  ['Jarvis！腦袋可以開支線，隊伍不准！','Jarvis! Your brain can take side quests. Your formation cannot!'],
  ['說好的伏地挺身，不是趴著思考人生！','I said push-ups, not lying down to reflect on life!'],
  ['別看旁邊的！末日反抗軍都還在練，你休息什麼？','Eyes front! The Resistance is still training. Who told you to rest?'],
  ['一二一！創業可以自己來，踏步給我整齊！','Left, right, left! Start a business solo. March in formation!']],'idle',11),
  actor(2152002,46,'末日反抗軍・法師','Resistance · mage',[
  ['魔力可以補，腿抖目前沒藥水。','Mana has potions. Shaky legs do not.'],
  ['教官沒喊停，先別幫自己下班。','The instructor has not called a halt. No clocking out.']],'training'),
  actor(2152003,72,'末日反抗軍・弩手','Resistance · archer',[
  ['瞄準的是靶，不是下課時間。','Aim at the target, not at break time.'],
  ['弩很穩，膝蓋另當別論。','Crossbow steady. Knees negotiable.']],'training'),
  actor(2152005,86,'末日反抗軍・機甲','Resistance · mechanic',[
  ['機甲保養完了，換我的腿需要保養。','Mech serviced. My legs need maintenance next.'],
  ['這不是待機模式，是蹲姿訓練！','This is squat training, not standby mode!']],'training')],
 [actor(1032104,45,'英文老師','English teacher',[
  ['不懂就問，點頭不能算口說成績。','Ask if you do not understand. Nodding earns no speaking score.'],
  ['文法可以修，別把自己先靜音。','Grammar can be fixed. Do not mute yourself.']]),
  actor(1012001,81,'閱覽室管理員','Reading room librarian',[
  ['今天的進度，不能只寫「今天有來」。','Today’s progress cannot just be “showed up.”'],
  ['準備出國？先準備明天的小考。','Going abroad? Prepare for tomorrow’s quiz first.']])],
 [actor(9201052,44,'研究生導師','Graduate mentor',[
  ['沙漠缺水，報告別再灌水。','The desert is dry. Keep the report free of filler too.'],
  ['模型很漂亮，假設在哪裡？','Lovely model. Where are the assumptions?']]),
  actor(1012109,81,'研究生同學','Graduate classmate',[
  ['外面四十度，截止日期照樣很冷酷。','Forty degrees outside. The deadline is still ice cold.'],
  ['咖啡續杯可以，資料來源也要補。','Refill the coffee. Add the sources too.']])],
 [actor(2110004,44,'現場工程師','Site engineer',[
  ['圖上走得通，現場還得再走一次。','It works on paper. Walk the site anyway.'],
  ['安全帽戴好，簡報不會替你擋東西。','Hard hat on. Slides will not protect your head.']],'work'),
  actor(2111008,81,'專案研究員','Project researcher',[
  ['有來源再下結論，猜得準也得驗證。','Sources before conclusions. Even a good guess needs checking.'],
  ['把問題問清楚，常常比多做十頁有用。','A clear question can beat ten more pages.']])],
 [actor(1002101,44,'路口旅人','Crossroads traveler',[
  ['地圖還有空白，先走一段才會開。','There is blank space on the map. Walk to reveal it.'],
  ['下一章沒劇透，行李倒是可以先收。','No spoilers for the next chapter. You can still pack.']]),
  actor(1012009,81,'補給商人','Supply merchant',[
  ['補給買好了？勇氣不能當飯吃。','Supplies ready? Courage is not a meal.'],
  ['存檔完成，別一直站在傳點前面發呆。','Game saved. Stop daydreaming in front of the portal.']])]
]);

// A scene without an upper platform keeps one speaker to the portal’s right and all authored lines.
const portalNpcScenes=npcScenes.map(actors=>[{...actors[0],lines:actors.flatMap(actor=>actor.lines)}]);
export const npcCast=(chapter,kind='native')=>(kind==='portal'?portalNpcScenes:npcScenes)[chapter]||[];
