// app.js - PRO.TWEET 2026 Engine Logic

let wildcardsData = null;
let isMultiMode = false;

// Fetch wildcards.json on initialization
async function initApp() {
    try {
        const response = await fetch('wildcards.json');
        wildcardsData = await response.json();
        
        // Attach Event Listeners
        document.getElementById('generate-btn').addEventListener('click', generateAutonomousContent);
        document.getElementById('random-btn').addEventListener('click', randomizeKeyword);
        document.getElementById('multi-mode-btn').addEventListener('click', toggleMultiMode);

        // First Generation
        generateAutonomousContent();
    } catch (err) {
        console.error("Error loading wildcards.json:", err);
    }
}

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomizeKeyword() {
    if (!wildcardsData) return;
    const random = getRandom(wildcardsData.niches);
    document.getElementById('keyword').value = random;
    generateAutonomousContent();
}

function toggleMultiMode() {
    isMultiMode = !isMultiMode;
    const btn = document.getElementById('multi-mode-btn');
    btn.innerText = isMultiMode ? "3 Variations" : "Single Post";
    btn.classList.toggle('border-blue-500');
    generateAutonomousContent();
}

function constructTweet(topic, strategy) {
    if (!wildcardsData) return "Loading Matrix...";

    let text = "";

    if (strategy === "contrarian") {
        const hook = getRandom(wildcardsData.hooks).replace(/{topic}/g, topic);
        const insight = getRandom(wildcardsData.insights).replace(/{topic}/g, topic);
        const twist = getRandom(wildcardsData.twists);
        text = `${hook}\n\n${insight}\n\n${twist}`;
    } 
    else if (strategy === "thread_hook") {
        const hook = getRandom(wildcardsData.hooks).replace(/{topic}/g, topic);
        const insight = getRandom(wildcardsData.insights).replace(/{topic}/g, topic);
        const cta = getRandom(wildcardsData.ctas).replace(/{topic}/g, topic);
        text = `${hook}\n\n${insight}\n\n🧵 Thread 👇\n\n${cta}`;
    } 
    else if (strategy === "framework") {
        const hook = `The 3-Step ${topic} Playbook:`;
        const insight = getRandom(wildcardsData.insights).replace(/{topic}/g, topic);
        const cta = getRandom(wildcardsData.ctas).replace(/{topic}/g, topic);
        text = `💡 ${hook}\n\n${insight}\n\n📌 ${cta}`;
    } 
    else if (strategy === "engagement") {
        text = getRandom(wildcardsData.baits).replace(/{topic}/g, topic);
    } 
    else { // Wildcard Chaos
        const hook = getRandom(wildcardsData.hooks).replace(/{topic}/g, topic);
        const insight = getRandom(wildcardsData.insights).replace(/{topic}/g, topic);
        const twist = getRandom(wildcardsData.twists);
        const cta = getRandom(wildcardsData.ctas).replace(/{topic}/g, topic);
        text = `${hook}\n\n${insight}\n\n${twist}\n\n${cta}`;
    }

    return text;
}

function generateAutonomousContent() {
    let topic = document.getElementById('keyword').value.trim();
    if (!topic) topic = "AI Tools";

    const strategy = document.getElementById('strategy').value;
    const container = document.getElementById('output-container');
    container.innerHTML = "";

    const count = isMultiMode ? 3 : 1;

    for (let i = 0; i < count; i++) {
        const tweetText = constructTweet(topic, strategy);
        const views = (Math.random() * 450 + 15).toFixed(1) + "K";
        const likes = (Math.floor(Math.random() * 9500 + 350)).toLocaleString();
        const retweets = (Math.floor(Math.random() * 1400 + 45)).toLocaleString();

        const cardHTML = `
            <div class="glass-card rounded-3xl p-6 neon-border-purple relative">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                            PRO
                        </div>
                        <div>
                            <div class="flex items-center space-x-1">
                                <span class="font-bold text-sm">Growth Architect</span>
                                <span class="text-blue-400 text-xs">✓</span>
                            </div>
                            <span class="text-gray-500 text-xs">@growth_matrix</span>
                        </div>
                    </div>
                    <span class="text-xs text-gray-500 font-mono">Variation #${i + 1}</span>
                </div>

                <div class="text-gray-100 text-base leading-relaxed mb-6 font-sans whitespace-pre-line">${tweetText}</div>

                <div class="pt-4 border-t border-white/10 flex justify-between text-xs text-gray-500 font-mono">
                    <span>👁️ ${views} Views</span>
                    <span>❤️ ${likes} Likes</span>
                    <span>🔄 ${retweets} Retweets</span>
                </div>

                <div class="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                    <span class="text-xs text-gray-500 font-mono">${tweetText.length} / 280 chars</span>
                    <button onclick="copySpecificTweet(this, \`${encodeURIComponent(tweetText)}\`)" 
                        class="bg-white/10 border border-white/20 px-5 py-2 rounded-xl text-xs font-bold hover:bg-white/20 transition">
                        📋 Copy Post
                    </button>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    }
}

function copySpecificTweet(btn, encodedText) {
    const text = decodeURIComponent(encodedText);
    navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.innerText;
        btn.innerText = "✓ Copied!";
        btn.classList.add("text-green-400", "border-green-500/50");
        setTimeout(() => {
            btn.innerText = originalText;
            btn.classList.remove("text-green-400", "border-green-500/50");
        }, 2000);
    });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initApp);
