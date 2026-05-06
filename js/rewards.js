const fifa26Float = document.getElementById("fifa26Float");
const fifa26Close = document.getElementById("fifa26Close");

fifa26Close.addEventListener("click", () => {
    fifa26Float.classList.add("is-hidden");
});

const SCRIPT_URL = document.currentScript ? document.currentScript.src : "";
const ASSET_BASE = SCRIPT_URL ? new URL("../image/", SCRIPT_URL).href : "image/";
const ASSETS = {
    baseInner: `${ASSET_BASE}base-inner.png`,
    rimFront: `${ASSET_BASE}rim-front.png`,
    baseOuter: `${ASSET_BASE}base-outer.png`,
    lidClosed: `${ASSET_BASE}lid-outer_unopen.png`,
    lidInner: `${ASSET_BASE}lid-inner.png`,
    lidOuter: `${ASSET_BASE}lid-outer.png`
};

const rewards = [
    {
        image: "image/icn__money.png",
        name: "MYR 1000",
        desc: "Congratulations! You won the grand prize!"
    },
    {
        image: "image/icn__money.png",
        name: "MYR 888",
        desc: "Lucky you! You received"
    },
    {
        image: "image/icn__money.png",
        name: "MYR 500",
        desc: "Lucky you! You received"
    },
    {
        image: "image/icn__money.png",
        name: "MYR 250",
        desc: "Congratulations! You won the grand prize!"
    },
    {
        image: "image/icn__money.png",
        name: "MYR 100",
        desc: "Congratulations! You received"
    },
    {
        image: "image/icn__money.png",
        name: "MYR 50",
        desc: "Congratulations! You received"
    },
    {
        image: "image/icn__money.png",
        name: "MYR 20",
        desc: "Congratulations! You received"
    },
    {
        image: "image/icn__money.png",
        name: "MYR 10",
        desc: "Congratulations! You received"
    }
];
const drawBtn = document.getElementById("drawBtn");
const closeLottery = document.getElementById("closeLottery");
const lotteryModal = document.getElementById("lotteryModal");
const boxesEl = document.getElementById("boxes");

const revealScene = document.getElementById("revealScene");
const revealStage = document.getElementById("revealStage");
const revealRays = document.getElementById("revealRays");
const revealChest = document.getElementById("revealChest");

const rewardIcon = document.getElementById("rewardIcon");
const rewardName = document.getElementById("rewardName");
const rewardDesc = document.getElementById("rewardDesc");
const againBtn = document.getElementById("againBtn");

const confettiLayer = document.getElementById("confettiLayer");


let isChoosing = false;
let hasChosen = false;
let lastHintIndex = -1;
let hintTimer = null;
function createTreasureHTML(extraClass = "") {
    return `
        <div class="treasure ${extraClass}">
            <img class="base-inner" src="${ASSETS.baseInner}" alt="">
            <img class="rim-front" src="${ASSETS.rimFront}" alt="">
            <div class="treasure__glow"></div>
            <img class="base-outer" src="${ASSETS.baseOuter}" alt="">
            <img class="lid-closed" src="${ASSETS.lidClosed}" alt="">
            <div class="lid-open">
                <img class="lid-inner" src="${ASSETS.lidInner}" alt="">
                <img class="lid-outer" src="${ASSETS.lidOuter}" alt="">
            </div>
        </div>
    `;
}

function renderBoxes() {
    boxesEl.innerHTML = "";

    for (let i = 0; i < 12; i++) {
        const box = document.createElement("button");
        box.type = "button";
        box.className = "box";
        box.dataset.index = i;
        box.style.animationDelay = `${i * 0.05}s`;
        box.innerHTML = createTreasureHTML();
        box.addEventListener("click", () => chooseBox(box));
        boxesEl.appendChild(box);
    }

    requestAnimationFrame(() => {
        boxesEl.classList.add("show");

        clearHintBox();

        hintTimer = setTimeout(() => {
            playRandomBoxHint();
        }, 900);
    });
}

function clearHintBox() {
    if (hintTimer) {
        clearTimeout(hintTimer);
        hintTimer = null;
    }

    boxesEl.querySelectorAll(".box.hint-shake").forEach((box) => {
        box.classList.remove("hint-shake");
    });
}

function playRandomBoxHint() {
    if (!isChoosing || hasChosen) {
        clearHintBox();
        return;
    }

    const boxes = [...boxesEl.querySelectorAll(".box")];
    if (!boxes.length) return;

    boxes.forEach((box) => {
        box.classList.remove("hint-shake");
    });

    let randomIndex = Math.floor(Math.random() * boxes.length);

    if (boxes.length > 1 && randomIndex === lastHintIndex) {
        randomIndex = (randomIndex + 1 + Math.floor(Math.random() * (boxes.length - 1))) % boxes.length;
    }

    lastHintIndex = randomIndex;

    const targetBox = boxes[randomIndex];
    targetBox.classList.add("hint-shake");

    const shakeDuration = 780;
    const breatheDelay = 800 + Math.random() * 800;

    hintTimer = setTimeout(() => {
        targetBox.classList.remove("hint-shake");

        hintTimer = setTimeout(() => {
            playRandomBoxHint();
        }, breatheDelay);
    }, shakeDuration);
}

function openLottery() {
    lotteryModal.classList.add("is-open");
    lotteryModal.setAttribute("aria-hidden", "false");

    resetLottery();
    renderBoxes();

    isChoosing = true;
    hasChosen = false;
}

function closeLotteryModal() {
    lotteryModal.classList.remove("is-open");
    lotteryModal.setAttribute("aria-hidden", "true");

    resetLottery();
}

function resetLottery() {
    clearHintBox();
    boxesEl.classList.remove("show");
    boxesEl.innerHTML = "";

    resetRevealScene();

    lotteryModal.classList.remove("is-revealing");

    isChoosing = false;
    hasChosen = false;
}

function resetRevealScene() {
    revealScene.classList.remove(
        "show",
        "fly-in",
        "land-on",
        "halo-on",
        "rays-on",
        "charge-on",
        "open-on",
        "reward-on"
    );

    revealChest.innerHTML = "";
    revealChest.style.removeProperty("--start-x");
    revealChest.style.removeProperty("--start-y");
    revealRays.innerHTML = "";
}

function launchConfetti(count = 72) {
    confettiLayer.innerHTML = "";

    const colors = [
        "#ff3b30",
        "#ff9500",
        "#ffcc00",
        "#34c759",
        "#00c7ff",
        "#007aff",
        "#af52de",
        "#ff2d55"
    ];

    for (let i = 0; i < count; i++) {
        const piece = document.createElement("span");
        const isRibbon = Math.random() > 0.58;

        piece.className = `confetti confetti--fall${isRibbon ? " confetti--ribbon" : ""}`;

        const color = colors[Math.floor(Math.random() * colors.length)];
        const duration = 1800 + Math.random() * 1600;
        const delay = Math.random() * 650;
        const drift = (Math.random() - 0.5) * 240;
        const rotate = `${360 + Math.random() * 900}deg`;

        piece.style.left = `${Math.random() * 100}%`;
        piece.style.top = `${-40 - Math.random() * 160}px`;
        piece.style.background = color;
        piece.style.animationDuration = `${duration}ms`;
        piece.style.animationDelay = `${delay}ms`;
        piece.style.setProperty("--drift-x", `${drift}px`);
        piece.style.setProperty("--rotate-end", rotate);

        if (!isRibbon) {
            piece.style.width = `${7 + Math.random() * 8}px`;
            piece.style.height = `${10 + Math.random() * 12}px`;
        }

        confettiLayer.appendChild(piece);

        setTimeout(() => {
            piece.remove();
        }, duration + delay + 400);
    }
}
async function chooseBox(selectedBox) {
    if (!isChoosing || hasChosen) return;

    clearHintBox();

    hasChosen = true;
    isChoosing = false;

    lotteryModal.classList.add("is-revealing");

    const reward = rewards[Math.floor(Math.random() * rewards.length)];

    await wait(140);
    playReveal(selectedBox, reward);
}

async function playReveal(selectedBox, reward) {
    rewardIcon.src = reward.image;
    rewardIcon.alt = reward.name;
    rewardName.textContent = reward.name;
    rewardDesc.textContent = reward.desc;

    resetRevealScene();

    const selectedTreasure = selectedBox.querySelector(".treasure");
    const stageRect = revealStage.getBoundingClientRect();
    const boxRect = selectedTreasure.getBoundingClientRect();

    const stageCenterX = stageRect.left + stageRect.width / 2;
    const stageCenterY = stageRect.top + stageRect.height / 2;
    const boxCenterX = boxRect.left + boxRect.width / 2;
    const boxCenterY = boxRect.top + boxRect.height / 2;

    revealChest.style.setProperty("--start-x", `${boxCenterX - stageCenterX}px`);
    revealChest.style.setProperty("--start-y", `${boxCenterY - stageCenterY}px`);
    revealChest.innerHTML = createTreasureHTML();

    revealScene.classList.add("show");

    await wait(80);

    revealScene.classList.add("fly-in");

    await wait(780);

    revealScene.classList.add("land-on");

    await wait(420);

    revealScene.classList.add("halo-on");

    await wait(220);

    createRays();
    revealScene.classList.add("rays-on");

    await wait(520);

    revealScene.classList.add("charge-on");

    await wait(560);

    revealScene.classList.remove("charge-on");
    revealScene.classList.add("open-on");

    const revealTreasure = revealChest.querySelector(".treasure");
    if (revealTreasure) {
        revealTreasure.classList.add("is-open");
    }

    await wait(460);

    revealScene.classList.add("reward-on");
    launchConfetti(80);
}

function createRays() {
    revealRays.innerHTML = "";
    const total = 18;

    for (let i = 0; i < total; i++) {
        const ray = document.createElement("span");
        ray.className = "revealScene__ray";
        ray.style.setProperty("--deg", `${(360 / total) * i}deg`);
        ray.style.animationDelay = `${i * 0.016}s`;
        revealRays.appendChild(ray);
    }
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

drawBtn.addEventListener("click", openLottery);
closeLottery.addEventListener("click", closeLotteryModal);

againBtn.addEventListener("click", () => {
    closeLotteryModal();
});

lotteryModal.addEventListener("click", (event) => {
    if (lotteryModal.classList.contains("is-revealing")) return;

    if (event.target.classList.contains("lotteryModal__backdrop")) {
        closeLotteryModal();
    }
});


const winnerTableBody = document.getElementById("winnerTableBody");
const winnerPager = document.getElementById("winnerPager");
const winnerPrevBtn = document.getElementById("winnerPrevBtn");
const winnerNextBtn = document.getElementById("winnerNextBtn");
const winnerPageText = document.getElementById("winnerPageText");
const winnerTabs = document.querySelectorAll("[data-winner-tab]");

const WINNER_PAGE_SIZE = 20;

let activeWinnerTab = "top20";
let lastWinnerPage = 1;

const top20Winners = [
    { username: "*****mega", date: "07-04-26 11:20", prize: "MYR 1000" },
    { username: "*****yuri", date: "07-04-26 11:20", prize: "MYR 200" },
    { username: "*****luna", date: "07-04-26 11:20", prize: "MYR 50" },
    { username: "*****nova", date: "07-04-26 11:20", prize: "MYR 20" },
    { username: "*****kira", date: "07-04-26 11:20", prize: "MYR 20" },
    { username: "*****mika", date: "07-04-26 11:20", prize: "MYR 20" },
    { username: "*****alex", date: "07-04-26 11:18", prize: "MYR 18" },
    { username: "*****nina", date: "07-04-26 11:18", prize: "MYR 18" },
    { username: "*****zane", date: "07-04-26 11:16", prize: "MYR 15" },
    { username: "*****rose", date: "07-04-26 11:16", prize: "MYR 15" },
    { username: "*****snow", date: "07-04-26 11:14", prize: "MYR 12" },
    { username: "*****ace", date: "07-04-26 11:14", prize: "MYR 12" },
    { username: "*****ruby", date: "07-04-26 11:12", prize: "MYR 10" },
    { username: "*****kai", date: "07-04-26 11:12", prize: "MYR 10" },
    { username: "*****momo", date: "07-04-26 11:10", prize: "MYR 10" },
    { username: "*****hana", date: "07-04-26 11:10", prize: "MYR 8" },
    { username: "*****leo", date: "07-04-26 11:08", prize: "MYR 8" },
    { username: "*****sora", date: "07-04-26 11:08", prize: "MYR 5" },
    { username: "*****riku", date: "07-04-26 11:06", prize: "MYR 5" },
    { username: "*****emi", date: "07-04-26 11:06", prize: "MYR 5" }
];

const lastWinners = [
    { username: "*****mega", date: "07-04-26 12:58", prize: "MYR 20" },
    { username: "*****yuri", date: "07-04-26 12:57", prize: "MYR 50" },
    { username: "*****luna", date: "07-04-26 12:56", prize: "MYR 10" },
    { username: "*****nova", date: "07-04-26 12:55", prize: "MYR 200" },
    { username: "*****kira", date: "07-04-26 12:54", prize: "MYR 20" },
    { username: "*****mika", date: "07-04-26 12:53", prize: "MYR 5" },
    { username: "*****alex", date: "07-04-26 12:52", prize: "MYR 100" },
    { username: "*****nina", date: "07-04-26 12:51", prize: "MYR 20" },
    { username: "*****zane", date: "07-04-26 12:50", prize: "MYR 50" },
    { username: "*****rose", date: "07-04-26 12:49", prize: "MYR 10" },
    { username: "*****snow", date: "07-04-26 12:48", prize: "MYR 20" },
    { username: "*****ace", date: "07-04-26 12:47", prize: "MYR 5" },
    { username: "*****ruby", date: "07-04-26 12:46", prize: "MYR 200" },
    { username: "*****kai", date: "07-04-26 12:45", prize: "MYR 20" },
    { username: "*****momo", date: "07-04-26 12:44", prize: "MYR 10" },
    { username: "*****hana", date: "07-04-26 12:43", prize: "MYR 50" },
    { username: "*****leo", date: "07-04-26 12:42", prize: "MYR 20" },
    { username: "*****sora", date: "07-04-26 12:41", prize: "MYR 5" },
    { username: "*****riku", date: "07-04-26 12:40", prize: "MYR 100" },
    { username: "*****emi", date: "07-04-26 12:39", prize: "MYR 20" },

    { username: "*****zen", date: "07-04-26 12:38", prize: "MYR 10" },
    { username: "*****rei", date: "07-04-26 12:37", prize: "MYR 20" },
    { username: "*****aki", date: "07-04-26 12:36", prize: "MYR 50" },
    { username: "*****rin", date: "07-04-26 12:35", prize: "MYR 5" },
    { username: "*****aya", date: "07-04-26 12:34", prize: "MYR 200" },
    { username: "*****mai", date: "07-04-26 12:33", prize: "MYR 20" },
    { username: "*****ken", date: "07-04-26 12:32", prize: "MYR 10" },
    { username: "*****jin", date: "07-04-26 12:31", prize: "MYR 100" },
    { username: "*****ren", date: "07-04-26 12:30", prize: "MYR 20" },
    { username: "*****rio", date: "07-04-26 12:29", prize: "MYR 50" },
    { username: "*****ivy", date: "07-04-26 12:28", prize: "MYR 5" },
    { username: "*****max", date: "07-04-26 12:27", prize: "MYR 20" },
    { username: "*****eva", date: "07-04-26 12:26", prize: "MYR 10" },
    { username: "*****sam", date: "07-04-26 12:25", prize: "MYR 200" },
    { username: "*****jay", date: "07-04-26 12:24", prize: "MYR 20" },
    { username: "*****ann", date: "07-04-26 12:23", prize: "MYR 100" },
    { username: "*****tom", date: "07-04-26 12:22", prize: "MYR 5" },
    { username: "*****mia", date: "07-04-26 12:21", prize: "MYR 50" },
    { username: "*****ian", date: "07-04-26 12:20", prize: "MYR 20" },
    { username: "*****zoe", date: "07-04-26 12:19", prize: "MYR 10" },

    { username: "*****neo", date: "07-04-26 12:18", prize: "MYR 20" },
    { username: "*****amy", date: "07-04-26 12:17", prize: "MYR 5" },
    { username: "*****ben", date: "07-04-26 12:16", prize: "MYR 50" },
    { username: "*****sky", date: "07-04-26 12:15", prize: "MYR 20" },
    { username: "*****joy", date: "07-04-26 12:14", prize: "MYR 100" },
    { username: "*****ray", date: "07-04-26 12:13", prize: "MYR 10" },
    { username: "*****kim", date: "07-04-26 12:12", prize: "MYR 200" },
    { username: "*****lee", date: "07-04-26 12:11", prize: "MYR 20" },
    { username: "*****dan", date: "07-04-26 12:10", prize: "MYR 5" },
    { username: "*****ela", date: "07-04-26 12:09", prize: "MYR 50" },
    { username: "*****oli", date: "07-04-26 12:08", prize: "MYR 20" },
    { username: "*****noa", date: "07-04-26 12:07", prize: "MYR 10" },
    { username: "*****lia", date: "07-04-26 12:06", prize: "MYR 100" },
    { username: "*****vic", date: "07-04-26 12:05", prize: "MYR 20" },
    { username: "*****pam", date: "07-04-26 12:04", prize: "MYR 5" },
    { username: "*****fox", date: "07-04-26 12:03", prize: "MYR 50" },
    { username: "*****cat", date: "07-04-26 12:02", prize: "MYR 20" },
    { username: "*****rex", date: "07-04-26 12:01", prize: "MYR 10" },
    { username: "*****bee", date: "07-04-26 12:00", prize: "MYR 200" },
    { username: "*****oak", date: "07-04-26 11:59", prize: "MYR 20" },

    { username: "*****sun", date: "07-04-26 11:58", prize: "MYR 10" },
    { username: "*****moon", date: "07-04-26 11:57", prize: "MYR 20" },
    { username: "*****star", date: "07-04-26 11:56", prize: "MYR 50" },
    { username: "*****wind", date: "07-04-26 11:55", prize: "MYR 5" },
    { username: "*****fire", date: "07-04-26 11:54", prize: "MYR 200" },
    { username: "*****rain", date: "07-04-26 11:53", prize: "MYR 20" },
    { username: "*****wave", date: "07-04-26 11:52", prize: "MYR 10" },
    { username: "*****leaf", date: "07-04-26 11:51", prize: "MYR 100" },
    { username: "*****rock", date: "07-04-26 11:50", prize: "MYR 20" },
    { username: "*****wolf", date: "07-04-26 11:49", prize: "MYR 50" },
    { username: "*****bear", date: "07-04-26 11:48", prize: "MYR 5" },
    { username: "*****lion", date: "07-04-26 11:47", prize: "MYR 20" },
    { username: "*****hawk", date: "07-04-26 11:46", prize: "MYR 10" },
    { username: "*****deer", date: "07-04-26 11:45", prize: "MYR 200" },
    { username: "*****seal", date: "07-04-26 11:44", prize: "MYR 20" },
    { username: "*****duck", date: "07-04-26 11:43", prize: "MYR 100" },
    { username: "*****frog", date: "07-04-26 11:42", prize: "MYR 5" },
    { username: "*****fish", date: "07-04-26 11:41", prize: "MYR 50" },
    { username: "*****bird", date: "07-04-26 11:40", prize: "MYR 20" },
    { username: "*****mint", date: "07-04-26 11:39", prize: "MYR 10" }
];


const AVATAR_BASE = "image/";

function getRandomAvatar() {
    const avatarNo = Math.floor(Math.random() * 12) + 1;
    return `${AVATAR_BASE}avatar${avatarNo}.png`;
}
function renderWinnerBoard() {
    const isTop20 = activeWinnerTab === "top20";
    const source = isTop20 ? top20Winners.slice(0, 20) : getLastWinnerPageItems();

    winnerTableBody.innerHTML = source.map((item, index) => {
        const rank = isTop20
            ? index + 1
            : (lastWinnerPage - 1) * WINNER_PAGE_SIZE + index + 1;

        const avatarSrc = item.avatar || getRandomAvatar();

        return `
        <tr>
            <td>${rank}</td>
            <td>
                <span class="winnerUser">
                    <span class="winnerUser__avatar">
                        <img src="${avatarSrc}" alt="">
                    </span>
                    <span class="winnerUser__name">${item.username}</span>
                </span>
            </td>
            <td>${item.date}</td>
            <td><span class="winnerPrize">${item.prize}</span></td>
        </tr>
    `;
    }).join("");

    updateWinnerPager();
}

function getLastWinnerPageItems() {
    const start = (lastWinnerPage - 1) * WINNER_PAGE_SIZE;
    return lastWinners.slice(start, start + WINNER_PAGE_SIZE);
}

function getLastWinnerTotalPages() {
    return Math.max(1, Math.ceil(lastWinners.length / WINNER_PAGE_SIZE));
}

function updateWinnerPager() {
    const isTop20 = activeWinnerTab === "top20";

    winnerPager.hidden = isTop20;
    winnerPager.style.display = isTop20 ? "none" : "flex";

    if (isTop20) return;

    const totalPages = getLastWinnerTotalPages();

    winnerPageText.textContent = `Page ${lastWinnerPage} / ${totalPages}`;
    winnerPrevBtn.disabled = lastWinnerPage <= 1;
    winnerNextBtn.disabled = lastWinnerPage >= totalPages;
}

winnerTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        activeWinnerTab = tab.dataset.winnerTab;

        winnerTabs.forEach((item) => {
            item.classList.toggle("is-active", item === tab);
        });

        if (activeWinnerTab === "last") {
            lastWinnerPage = 1;
        }

        renderWinnerBoard();
    });
});

winnerPrevBtn.addEventListener("click", () => {
    if (lastWinnerPage <= 1) return;

    lastWinnerPage -= 1;
    renderWinnerBoard();
});

winnerNextBtn.addEventListener("click", () => {
    const totalPages = getLastWinnerTotalPages();

    if (lastWinnerPage >= totalPages) return;

    lastWinnerPage += 1;
    renderWinnerBoard();
});

renderWinnerBoard();

