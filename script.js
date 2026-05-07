// Gaussian Pro 2026 - Config & Multi-language Support
const GEMINI_API_KEY = "AIzaSyDe3UZjYospDfmZKaBMi1YMoUcVGscMVFQ";
let currentRows = 0;
let currentCols = 0;
let currentLang = 'en';

const translations = {
    en: {
        badge_text: "Numerical Methods 2026",
        title_1: "Gaussian",
        title_2: "Elimination",
        hero_desc: "High-Precision Linear Solver with AI Assistance",
        config_title: "System Configuration",
        rows_label: "Equations (Rows)",
        cols_label: "Variables (Xn)",
        btn_init: "Initialize",
        team_title: "Development Team",
        role_lead: "Lead",
        role_partner: "Partner",
        btn_solve: "Solve System Now",
        btn_copy: "Copy Matrix",
        ai_header: "✨ Math AI Assistant",
        ai_welcome: "Hi! I'm Gemini AI. I can help you understand the Gaussian process or explain the math behind your matrix.",
        ai_send: "Send",
        step_title: "Step-by-Step Solution",
        final_sol: "Final Solution Vector",
        alert_dim: "Invalid dimensions",
        alert_fill: "Please fill all cells",
        alert_pdf: "Please solve the matrix first to generate a report!",
        elim_col: "Eliminating Column",
        placeholder_b: "b"
    },
    ar: {
        badge_text: "الطرق العددية 2026",
        title_1: "حذف",
        title_2: "جاوس",
        hero_desc: "حل المعادلات الخطية بدقة عالية مع دعم الذكاء الاصطناعي",
        config_title: "إعدادات النظام",
        rows_label: "المعادلات (الصفوف)",
        cols_label: "المجاهيل (Xn)",
        btn_init: "إنشاء المصفوفة",
        team_title: "فريق التطوير",
        role_lead: "قائد الفريق",
        role_partner: "شريك",
        btn_solve: "حل النظام الآن",
        btn_copy: "نسخ المصفوفة",
        ai_header: "✨ مساعد الرياضيات الذكي",
        ai_welcome: "مرحباً! أنا Gemini. يمكنني مساعدتك في فهم طريقة جاوس أو شرح الرياضيات وراء مصفوفتك.",
        ai_send: "إرسال",
        step_title: "الحل خطوة بخطوة",
        final_sol: "مجموعة الحل النهائية",
        alert_dim: "أبعاد غير صالحة",
        alert_fill: "يرجى ملء جميع الخلايا",
        alert_pdf: "يرجى حل المصفوفة أولاً لإنشاء التقرير!",
        elim_col: "تصفير العمود",
        placeholder_b: "الناتج"
    }
};

// --- Language Switcher ---
document.getElementById('language-select').addEventListener('change', (e) => {
    setLanguage(e.target.value);
});

function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // --- الجزء المسؤول عن تثبيت مكان الأيقونات برمجياً ---
    const topActions = document.querySelector('.top-actions');
    if (lang === 'ar') {
        topActions.style.left = 'auto';
        topActions.style.right = '20px';
    } else {
        topActions.style.right = '20px';
        topActions.style.left = 'auto';
    }

    // تحديث النصوص
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    // تحديث الـ Placeholders
    for (let i = 0; i < currentRows; i++) {
        for (let j = 0; j <= currentCols; j++) {
            const input = document.getElementById(`m-${i}-${j}`);
            if (input) {
                input.placeholder = j === currentCols ? translations[lang].placeholder_b : `x${j+1}`;
            }
        }
    }
}

// --- Matrix Engine ---
function generateMatrix() {
    const rows = document.getElementById('rows').value;
    const cols = document.getElementById('cols').value;
    currentRows = parseInt(rows);
    currentCols = parseInt(cols);
    
    if (currentRows <= 0) return alert(translations[currentLang].alert_dim);

    const wrapper = document.getElementById('matrix-wrapper');
    wrapper.innerHTML = '';
    document.getElementById('matrix-section').classList.remove('hidden');
    document.getElementById('steps-container').innerHTML = '';

    for (let i = 0; i < currentRows; i++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'matrix-row';
        for (let j = 0; j <= currentCols; j++) {
            if (j === currentCols) {
                const sep = document.createElement('div');
                sep.className = 'v-line';
                rowDiv.appendChild(sep);
            }
            const input = document.createElement('input');
            input.type = 'number';
            input.id = `m-${i}-${j}`;
            input.placeholder = j === currentCols ? translations[currentLang].placeholder_b : `x${j+1}`;
            rowDiv.appendChild(input);
        }
        wrapper.appendChild(rowDiv);
    }
}

function fillRandom() {
    if (currentRows === 0) generateMatrix();
    for (let i = 0; i < currentRows; i++) {
        for (let j = 0; j <= currentCols; j++) {
            const val = Math.floor(Math.random() * 21) - 10;
            const el = document.getElementById(`m-${i}-${j}`);
            if(el) el.value = val;
        }
    }
}

// --- Gaussian Solver ---
// --- Gaussian Solver ---
function solve() {
    let matrix = [];
    for (let i = 0; i < currentRows; i++) {
        matrix[i] = [];
        for (let j = 0; j <= currentCols; j++) {
            const el = document.getElementById(`m-${i}-${j}`);
            if (!el || isNaN(parseFloat(el.value))) return alert(translations[currentLang].alert_fill);
            matrix[i][j] = parseFloat(el.value);
        }
    }

    const container = document.getElementById('steps-container');
    container.innerHTML = `<h2 style="margin:40px 0; text-align:center; color:var(--primary);">${translations[currentLang].step_title}</h2>`;

    let workingMatrix = JSON.parse(JSON.stringify(matrix));

    // Forward Elimination
    for (let i = 0; i < Math.min(currentRows, currentCols); i++) {

        // Pivoting
        let maxRow = i;
        for (let k = i + 1; k < currentRows; k++) {
            if (Math.abs(workingMatrix[k][i]) > Math.abs(workingMatrix[maxRow][i])) {
                maxRow = k;
            }
        }

        if (maxRow !== i) {
            [workingMatrix[i], workingMatrix[maxRow]] = [workingMatrix[maxRow], workingMatrix[i]];
        }

        if (Math.abs(workingMatrix[i][i]) < 0.000001) continue;

        for (let k = i + 1; k < currentRows; k++) {

            const factor = workingMatrix[k][i] / workingMatrix[i][i];
            const notation = `R${k+1} = R${k+1} - (${factor.toFixed(2)})R${i+1}`;

            for (let j = i; j <= currentCols; j++) {
                workingMatrix[k][j] -= factor * workingMatrix[i][j];
            }

            renderStep(
                JSON.parse(JSON.stringify(workingMatrix)),
                `${translations[currentLang].elim_col} ${i+1}`,
                notation
            );
        }
    }

    // Determine system type
    let rank = 0;
    let inconsistent = false;

    for (let i = 0; i < currentRows; i++) {

        let allZero = true;

        for (let j = 0; j < currentCols; j++) {
            if (Math.abs(workingMatrix[i][j]) > 0.000001) {
                allZero = false;
                break;
            }
        }

        if (allZero && Math.abs(workingMatrix[i][currentCols]) > 0.000001) {
            inconsistent = true;
            break;
        }

        if (!allZero) rank++;
    }

    let solutionType = "";

    if (inconsistent) {
        solutionType = currentLang === 'ar'
            ? "لا يوجد حل للنظام"
            : "No Solution";
    }
    else if (rank < currentCols) {
        solutionType = currentLang === 'ar'
            ? "يوجد عدد لا نهائي من الحلول"
            : "Infinite Solutions";
    }
    else {
        solutionType = currentLang === 'ar'
            ? "يوجد حل وحيد"
            : "Unique Solution";
    }

    // Back Substitution only if unique solution
    const results = new Array(currentCols).fill(0);

    if (!inconsistent && rank === currentCols) {

        for (let i = currentCols - 1; i >= 0; i--) {

            let sum = 0;

            for (let j = i + 1; j < currentCols; j++) {
                sum += workingMatrix[i][j] * results[j];
            }

            results[i] =
                (workingMatrix[i][currentCols] - sum) /
                workingMatrix[i][i];
        }
    }

    renderFinalResults(results, solutionType, !inconsistent && rank === currentCols);
}

function renderFinalResults(results, solutionType, hasUniqueSolution) {

    const container = document.getElementById('steps-container');

    const resDiv = document.createElement('div');

    resDiv.className = 'step-card';

    resDiv.style.borderTop = "4px solid var(--success)";

    let html = `
    <div class="step-header">
        <h3>${translations[currentLang].final_sol}</h3>
        <div class="badge" style="background:var(--success)">
            ${solutionType}
        </div>
    </div>
    `;

    if (hasUniqueSolution) {

        html += `
        <div style="
            display:flex;
            gap:15px;
            flex-wrap:wrap;
            justify-content:center;
            padding:20px;
        ">
        `;

        results.forEach((val, i) => {

            html += `
            <div class="btn-main" style="
                display:flex;
                align-items:center;
                justify-content:center;
                min-width:140px;
            ">
                X${i+1} = ${val.toFixed(4)}
            </div>
            `;
        });

        html += `</div>`;
    }

    resDiv.innerHTML = html;

    container.appendChild(resDiv);

    resDiv.scrollIntoView({ behavior: 'smooth' });
}
    matrixHTML += '</div>';

    stepCard.innerHTML = `
        <div class="step-header">
            <h3>${title}</h3>
            <span class="notation-badge" dir="ltr">${notation}</span>
        </div>
        <div class="step-content" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; align-items: center;">
            <div class="explanation-box" style="margin-bottom: 0;">
                <p>${dynamicExplanation}</p>
            </div>
            <div style="overflow-x:auto; background: rgba(0,0,0,0.1); padding: 15px; border-radius: 12px;">
                ${matrixHTML}
            </div>
        </div>`;
    container.appendChild(stepCard);
}

function renderFinalResults(results) {
    const container = document.getElementById('steps-container');
    const resDiv = document.createElement('div');
    resDiv.className = 'step-card';
    resDiv.style.borderTop = "4px solid var(--success)";
    
    let html = `<div class="step-header"><h3>${translations[currentLang].final_sol}</h3><div class="badge" style="background:var(--success)">Solved</div></div>
                <div style="display:flex; gap:15px; flex-wrap:wrap; justify-content:center; padding:20px;">`;
    results.forEach((val, i) => {
        html += `<div class="btn-main" style="display:flex; align-items:center; justify-content:center; min-width:140px;">X${i+1} = ${val.toFixed(4)}</div>`;
    });
    html += `</div>`;
    resDiv.innerHTML = html;
    container.appendChild(resDiv);
    resDiv.scrollIntoView({ behavior: 'smooth' });
}

// --- AI Chat Logic ---
async function askAI() {
    const inputField = document.getElementById('ai-input');
    const chatBody = document.getElementById('ai-chat-body');
    const msg = inputField.value.trim();
    if (!msg) return;

    const userDiv = document.createElement('div');
    userDiv.className = 'user-msg';
    userDiv.textContent = msg;
    chatBody.appendChild(userDiv);
    inputField.value = '';

    const loadingId = 'loading-' + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'ai-msg';
    loadingDiv.id = loadingId;
    loadingDiv.textContent = currentLang === 'ar' ? "جاري سؤال Gemini..." : "Asking Gemini AI...";
    chatBody.appendChild(loadingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `You are a helpful mathematical assistant. User language is ${currentLang}. User says: ${msg}` }] }]
            })
        });
        const data = await response.json();
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            document.getElementById(loadingId).textContent = data.candidates[0].content.parts[0].text;
        }
    } catch (error) {
        document.getElementById(loadingId).textContent = "Error connecting to AI.";
    }
    chatBody.scrollTop = chatBody.scrollHeight;
}

function toggleChat() {
    document.getElementById('ai-chat-container').classList.toggle('ai-chat-closed');
}

// --- Utilities ---
const themeBtn = document.getElementById('theme-toggle');
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    document.getElementById('sun-icon').style.display = isLight ? 'none' : 'block';
    document.getElementById('moon-icon').style.display = isLight ? 'block' : 'none';
});

function exportToPDF() {
    const element = document.getElementById('steps-container');
    if (!element || element.innerHTML.trim() === "") return alert(translations[currentLang].alert_pdf);
    const opt = { 
        margin: 10, 
        filename: 'Gaussian_Solution.pdf', 
        html2canvas: { scale: 2 }, 
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } 
    };
    html2pdf().set(opt).from(element).save();
}

function copyMatrix(event) {
    let matrixData = "";
    for (let i = 0; i < currentRows; i++) {
        let rowData = [];
        for (let j = 0; j <= currentCols; j++) {
            const el = document.getElementById(`m-${i}-${j}`);
            rowData.push(el ? el.value : "0");
        }
        matrixData += rowData.join("\t") + "\n";
    }
    navigator.clipboard.writeText(matrixData).then(() => {
        const btn = event.currentTarget;
        const originalHTML = btn.innerHTML;
        btn.innerText = currentLang === 'ar' ? "تم النسخ!" : "Copied!";
        setTimeout(() => btn.innerHTML = originalHTML, 2000);
    });
}
