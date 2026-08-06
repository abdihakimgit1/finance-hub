// ============================================================
// 1. SECURE LOGIN
// ============================================================
const DEFAULT_USER = 'admin@system.com';
const DEFAULT_PASS = 'Moha2528$#';

// Session timeout variables
let sessionTimeout;
let warningTimeout;
const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 daqiiqo
const WARNING_TIME = 60 * 1000; // 1 daqiiqo ka hor warning

function getStoredCredentials() {
    const stored = localStorage.getItem('fin_credentials');
    if (stored) return JSON.parse(stored);
    return { username: DEFAULT_USER, password: DEFAULT_PASS };
}

function saveCredentials(username, password) {
    localStorage.setItem('fin_credentials', JSON.stringify({ username, password }));
}

function isLoggedIn() {
    return localStorage.getItem('fin_session') === 'true';
}

function resetSessionTimer() {
    clearTimeout(sessionTimeout);
    clearTimeout(warningTimeout);
    const warningEl = document.getElementById('sessionWarning');
    if (warningEl) warningEl.classList.add('hidden');
    
    // Show warning 1 minute before timeout
    warningTimeout = setTimeout(() => {
        const warningEl2 = document.getElementById('sessionWarning');
        if (warningEl2) warningEl2.classList.remove('hidden');
    }, SESSION_TIMEOUT - WARNING_TIME);
    
    sessionTimeout = setTimeout(() => {
        const warningEl3 = document.getElementById('sessionWarning');
        if (warningEl3) warningEl3.classList.add('hidden');
        handleLogout();
        alert("Your session has expired due to inactivity. Please sign in again.");
    }, SESSION_TIMEOUT);
}

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUser').value.trim();
    const password = document.getElementById('loginPass').value.trim();
    const errorEl = document.getElementById('loginError');

    if (!username || !password) {
        errorEl.classList.remove('hidden');
        errorEl.textContent = 'Fadlan buuxi dhammaan meelaha!';
        return;
    }

    const creds = getStoredCredentials();

    if (username === creds.username && password === creds.password) {
        localStorage.setItem('fin_session', 'true');
        errorEl.classList.add('hidden');
        showApp();
    } else {
        errorEl.classList.remove('hidden');
        errorEl.textContent = 'Username ama Password khalad!';
    }
}

function handleLogout() {
    localStorage.removeItem('fin_session');
    clearTimeout(sessionTimeout);
    clearTimeout(warningTimeout);
    const warningEl = document.getElementById('sessionWarning');
    if (warningEl) warningEl.classList.add('hidden');
    const appContainer = document.getElementById('appContainer');
    if (appContainer) appContainer.classList.add('hidden');
    const loginPage = document.getElementById('loginPage');
    if (loginPage) loginPage.classList.remove('hidden');
    // Clear login password field
    const loginPass = document.getElementById('loginPass');
    if (loginPass) loginPass.value = '';
}

function showApp() {
    const loginPage = document.getElementById('loginPage');
    const appContainer = document.getElementById('appContainer');
    if (loginPage) loginPage.classList.add('hidden');
    if (appContainer) appContainer.classList.remove('hidden');
    resetSessionTimer();
    initApp();
}

// ============================================================
// 2. APP LOGIC
// ============================================================
const defaultAccounts = {
    cash: { label: "Cash Balance", currencies: { USD: 0, SLSH: 0, ETB: 0 } },
    zaad: { label: "Zaad (Mobile Money SL)", currencies: { USD: 0, SLSH: 0 } },
    edahab: { label: "eDahab (Mobile Money SL)", currencies: { USD: 0, SLSH: 0 } },
    kaashplus: { label: "Kaashplus (Mobile Money SL)", currencies: { USD: 0, SLSH: 0 } },
    darasalaam: { label: "Darasalaam Bank", currencies: { USD: 0, SLSH: 0 } },
    dahabshiil: { label: "Dahabshiil Bank", currencies: { USD: 0, SLSH: 0 } },
    ebirr: { label: "eBirr (Mobile Money ET)", currencies: { ETB: 0 } },
    telebirr: { label: "Telebirr (Mobile Money ET)", currencies: { ETB: 0 } },
    mpesa_et: { label: "M-Pesa (Mobile Money ET)", currencies: { ETB: 0 } },
    kaafimf: { label: "Kaafimf Bank", currencies: { ETB: 0 } }
};

let accounts = JSON.parse(localStorage.getItem('fin_accounts')) || defaultAccounts;
let loans = JSON.parse(localStorage.getItem('fin_loans')) || [];
let transactions = JSON.parse(localStorage.getItem('fin_transactions')) || [];
let profile = JSON.parse(localStorage.getItem('fin_profile')) || { name: "Abdi Poultry Developer", role: "System Administrator" };
let currentLang = localStorage.getItem('fin_lang') || 'so';
let currentTheme = localStorage.getItem('fin_theme') || 'dark';
let isBalancesHidden = JSON.parse(localStorage.getItem('fin_hide_balance')) || false;

function initApp() {
    initProfileAndSettings();
    syncDataUX();
    updateClockAndGreeting();
    switchTab('dashboard');
    applyTheme();
    // Reset session timer on user activity
    document.addEventListener('click', resetSessionTimer);
    document.addEventListener('keydown', resetSessionTimer);
    document.addEventListener('mousemove', resetSessionTimer);
}

function applyTheme() {
    const body = document.getElementById('bodyCtx');
    const toggle = document.getElementById('themeToggle');
    if (currentTheme === 'light') {
        body.className = "theme-light pb-20 md:pb-0";
        if (toggle) { toggle.classList.remove('active'); }
    } else {
        body.className = "theme-dark pb-20 md:pb-0";
        if (toggle) { toggle.classList.add('active'); }
    }
}

function toggleTheme() {
    const toggle = document.getElementById('themeToggle');
    if (currentTheme === 'dark') {
        currentTheme = 'light';
        toggle.classList.remove('active');
    } else {
        currentTheme = 'dark';
        toggle.classList.add('active');
    }
    localStorage.setItem('fin_theme', currentTheme);
    applyTheme();
}

function updateClockAndGreeting() {
    const now = new Date();
    const hours = now.getHours();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    
    const liveClock = document.getElementById('liveClock');
    if (liveClock) liveClock.innerText = timeString;

    let greeting = "";
    if (currentLang === 'en') {
        if (hours < 12) greeting = "Good morning";
        else if (hours < 18) greeting = "Good afternoon";
        else greeting = "Good evening";
    } else {
        if (hours < 12) greeting = "Subax wanaagsan";
        else if (hours < 18) greeting = "Galab wanaagsan";
        else greeting = "Habeen wanaagsan";
    }
    const greetingText = document.getElementById('greetingText');
    const mGreetingText = document.getElementById('mGreetingText');
    if (greetingText) greetingText.innerText = `${greeting}! 👋`;
    if (mGreetingText) mGreetingText.innerText = `${greeting}! 👋`;
}
setInterval(updateClockAndGreeting, 1000);

function toggleVisibility() {
    isBalancesHidden = !isBalancesHidden;
    localStorage.setItem('fin_hide_balance', JSON.stringify(isBalancesHidden));
    updateEyeIcon();
    renderDashboard();
    renderActiveLoansSelectors();
    renderReports();
}

function updateEyeIcon() {
    const btn = document.getElementById('hideBtn');
    if (isBalancesHidden) {
        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
            </svg>`;
    } else {
        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 hover:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>`;
    }
}

function switchTab(tabId) {
    triggerLoadingAnimation(() => {
        ['dashboard', 'deposit', 'withdraw', 'loans', 'reports', 'settings'].forEach(t => {
            const view = document.getElementById(`view-${t}`);
            if (view) view.classList.add('hidden');
            const sBtn = document.getElementById(`sidebar-${t}`);
            if(sBtn) sBtn.className = "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white font-medium text-left transition-all sidebar-btn";
            const mBtn = document.getElementById(`mobile-${t}`);
            if(mBtn) mBtn.className = "flex flex-col items-center gap-0.5 text-slate-400 mobile-nav-btn";
        });
        const activeView = document.getElementById(`view-${tabId}`);
        if (activeView) activeView.classList.remove('hidden');
        const activeSidebar = document.getElementById(`sidebar-${tabId}`);
        if(activeSidebar) activeSidebar.className = "w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-600 text-white font-medium text-left transition-all sidebar-btn active";
        const activeMobile = document.getElementById(`mobile-${tabId}`);
        if(activeMobile) activeMobile.className = "flex flex-col items-center gap-0.5 text-emerald-400 mobile-nav-btn active";
        
        // Render reports when switching to reports tab
        if (tabId === 'reports') {
            renderReports();
        }
    });
}

function triggerLoadingAnimation(callback) {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.remove('hidden');
    setTimeout(() => { callback(); overlay.classList.add('hidden'); }, 200);
}

function renderDashboard() {
    const grid = document.getElementById('accountsGrid');
    grid.innerHTML = '';
    Object.keys(accounts).forEach(key => {
        const acc = accounts[key];
        let currencyHTML = '';
        Object.keys(acc.currencies).forEach(cur => {
            let symbol = cur === 'USD' ? '$' : ' ';
            let displayValue = isBalancesHidden ? '••••••' : `${symbol}${Number(acc.currencies[cur]).toLocaleString()}`;
            
            currencyHTML += `
                <div class="flex justify-between items-center border-b border-slate-700/50 py-2 last:border-0">
                    <span class="text-xs text-slate-400 font-medium">${cur}</span>
                    <span class="font-mono text-white text-md font-bold">${displayValue}</span>
                </div>
            `;
        });
        grid.innerHTML += `
            <div class="bg-slate-800 rounded-xl border border-slate-700 p-4 shadow-sm card-item" data-account-label="${acc.label.toLowerCase()}">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="font-semibold text-emerald-400 text-sm tracking-wide">${acc.label}</h3>
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </div>
                <div class="space-y-0.5">${currencyHTML}</div>
            </div>
        `;
    });
}

function filterAccounts() {
    const query = document.getElementById('accountSearch').value.toLowerCase();
    document.querySelectorAll('.card-item').forEach(card => {
        const label = card.getAttribute('data-account-label');
        if (label.includes(query)) card.classList.remove('hidden');
        else card.classList.add('hidden');
    });
}

// ============================================================
// 3. DEPOSIT
// ============================================================
function handleDeposit(e) {
    e.preventDefault();
    const accKey = document.getElementById('depositAccount').value;
    const currency = document.getElementById('depositCurrency').value;
    const amount = parseFloat(document.getElementById('depositAmount').value);
    if (isNaN(amount) || amount <= 0) return;

    triggerLoadingAnimation(() => {
        accounts[accKey].currencies[currency] += amount;
        
        // Add transaction record
        addTransaction({
            type: 'deposit',
            account: accounts[accKey].label,
            currency: currency,
            amount: amount,
            description: `Deposit to ${accounts[accKey].label}`
        });
        
        saveToLocalStorage();
        document.getElementById('depositForm').reset();
        syncDataUX();
        alert(currentLang === 'en' ? "Deposit successful!" : "Lacagta waa lagu shubay!");
        resetSessionTimer();
    });
}

// ============================================================
// 4. WITHDRAW
// ============================================================
function handleWithdraw(e) {
    e.preventDefault();
    const accKey = document.getElementById('withdrawAccount').value;
    const currency = document.getElementById('withdrawCurrency').value;
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    if (isNaN(amount) || amount <= 0) return;

    if (accounts[accKey].currencies[currency] < amount) {
        alert(currentLang === 'en' ? "Insufficient balance!" : "Haraaga akoonka kuma filna!");
        return;
    }

    triggerLoadingAnimation(() => {
        accounts[accKey].currencies[currency] -= amount;
        
        // Add transaction record
        addTransaction({
            type: 'withdraw',
            account: accounts[accKey].label,
            currency: currency,
            amount: amount,
            description: `Withdrawal from ${accounts[accKey].label}`
        });
        
        saveToLocalStorage();
        document.getElementById('withdrawForm').reset();
        syncDataUX();
        alert(currentLang === 'en' ? "Withdrawal successful!" : "Lacagta waa laga baxay!");
        resetSessionTimer();
    });
}

// ============================================================
// 5. LOANS
// ============================================================
function populateFormOptions() {
    const depositSelect = document.getElementById('depositAccount');
    const withdrawSelect = document.getElementById('withdrawAccount');
    const sourceSelect = document.getElementById('loanSource');
    if (depositSelect) depositSelect.innerHTML = '';
    if (withdrawSelect) withdrawSelect.innerHTML = '';
    if (sourceSelect) sourceSelect.innerHTML = '';

    Object.keys(accounts).forEach(key => {
        if (depositSelect) {
            let opt1 = document.createElement('option'); opt1.value = key; opt1.text = accounts[key].label;
            depositSelect.appendChild(opt1);
        }
        if (withdrawSelect) {
            let opt2 = document.createElement('option'); opt2.value = key; opt2.text = accounts[key].label;
            withdrawSelect.appendChild(opt2);
        }
        if (sourceSelect) {
            let opt3 = document.createElement('option'); opt3.value = key; opt3.text = accounts[key].label;
            sourceSelect.appendChild(opt3);
        }
    });
    updateDepositCurrencyOptions(); 
    updateWithdrawCurrencyOptions(); 
    updateLoanCurrencyOptions(); 
    renderActiveLoansSelectors();
}

function updateDepositCurrencyOptions() {
    const sourceKey = document.getElementById('depositAccount').value;
    const currencySelect = document.getElementById('depositCurrency');
    currencySelect.innerHTML = '';
    if(accounts[sourceKey]) {
        Object.keys(accounts[sourceKey].currencies).forEach(cur => {
            let option = document.createElement('option'); option.value = cur; option.text = cur;
            currencySelect.appendChild(option);
        });
    }
}

function updateWithdrawCurrencyOptions() {
    const sourceKey = document.getElementById('withdrawAccount').value;
    const currencySelect = document.getElementById('withdrawCurrency');
    currencySelect.innerHTML = '';
    if(accounts[sourceKey]) {
        Object.keys(accounts[sourceKey].currencies).forEach(cur => {
            let option = document.createElement('option'); option.value = cur; option.text = cur;
            currencySelect.appendChild(option);
        });
    }
}

function updateLoanCurrencyOptions() {
    const sourceKey = document.getElementById('loanSource').value;
    const currencySelect = document.getElementById('loanCurrency');
    currencySelect.innerHTML = '';
    if(accounts[sourceKey]) {
        Object.keys(accounts[sourceKey].currencies).forEach(cur => {
            let option = document.createElement('option'); option.value = cur; option.text = cur;
            currencySelect.appendChild(option);
        });
    }
}

function handleGiveLoan(e) {
    e.preventDefault();
    const debtor = document.getElementById('loanDebtor').value.trim();
    const source = document.getElementById('loanSource').value;
    const currency = document.getElementById('loanCurrency').value;
    const amount = parseFloat(document.getElementById('loanAmount').value);

    if (accounts[source].currencies[currency] < amount) {
        alert(currentLang === 'en' ? "Insufficient funds!" : "Haraaga akoonku kuma filna!");
        return;
    }

    triggerLoadingAnimation(() => {
        accounts[source].currencies[currency] -= amount;
        const loanData = {
            id: Date.now(), 
            debtor, 
            sourceKey: source, 
            sourceLabel: accounts[source].label, 
            currency, 
            originalAmount: amount, 
            remainingAmount: amount, 
            status: 'Active'
        };
        loans.push(loanData);
        
        // Add transaction record
        addTransaction({
            type: 'loan',
            account: accounts[source].label,
            currency: currency,
            amount: amount,
            description: `Loan given to ${debtor}`
        });
        
        saveToLocalStorage(); 
        document.getElementById('loanForm').reset(); 
        syncDataUX();
        alert(currentLang === 'en' ? "Loan successful!" : "Amaahdii waa la bixiyay!");
        resetSessionTimer();
    });
}

function handleRepayLoan(e) {
    e.preventDefault();
    const loanId = parseInt(document.getElementById('repayLoanSelect').value);
    const amount = parseFloat(document.getElementById('repayAmount').value);
    if (!loanId || isNaN(amount) || amount <= 0) return;

    const loan = loans.find(l => l.id === loanId);
    if (amount > loan.remainingAmount) {
        alert(currentLang === 'en' ? "Amount exceeds debt!" : "Lacagtu waa ka badantahay amaahda!");
        return;
    }

    triggerLoadingAnimation(() => {
        accounts[loan.sourceKey].currencies[loan.currency] += amount;
        loan.remainingAmount -= amount;
        if (loan.remainingAmount <= 0) loan.status = 'Paid';
        
        // Add transaction record
        addTransaction({
            type: 'repayment',
            account: loan.sourceLabel,
            currency: loan.currency,
            amount: amount,
            description: `Loan repayment from ${loan.debtor}`
        });
        
        saveToLocalStorage(); 
        document.getElementById('repayForm').reset(); 
        syncDataUX();
        alert(currentLang === 'en' ? "Repayment successful!" : "Lacagtii waa lagu soo celiyay akoonka!");
        resetSessionTimer();
    });
}

function deleteLoan(loanId) {
    if (!confirm("Are you sure wanto delete loans?")) return;
    loans = loans.filter(l => l.id !== loanId);
    saveToLocalStorage();
    syncDataUX();
    alert("Loan deleted successful!");
}

function renderActiveLoansSelectors() {
    const repaySelect = document.getElementById('repayLoanSelect');
    if (repaySelect) {
        repaySelect.innerHTML = '<option value="">[--Select--]</option>';
        loans.forEach(l => {
            if (l.status === 'Active') {
                let option = document.createElement('option'); 
                option.value = l.id; 
                option.text = `${l.debtor} (${isBalancesHidden ? '••••' : l.remainingAmount} ${l.currency})`;
                repaySelect.appendChild(option);
            }
        });
    }

    const tbody = document.getElementById('loanTableBody'); 
    if (!tbody) return;
    tbody.innerHTML = '';
    if(loans.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-slate-500">Ma jirto amaah.</td></tr>`; 
        return;
    }
    loans.forEach(l => {
        let statusBadge = l.status === 'Active' ? `<span class="text-yellow-400">Active</span>` : `<span class="text-emerald-400">Paid</span>`;
        
        let dispOriginal = isBalancesHidden ? '•••••' : l.originalAmount;
        let dispRemaining = isBalancesHidden ? '•••••' : l.remainingAmount;

        tbody.innerHTML += `
            <tr class="border-b border-slate-700/40 text-xs">
                <td class="p-3 text-white">${l.debtor}</td>
                <td class="p-3 text-slate-400">${l.sourceLabel}</td>
                <td class="p-3">${dispOriginal} ${l.currency}</td>
                <td class="p-3 font-bold text-emerald-400">${dispRemaining} ${l.currency}</td>
                <td class="p-3">${statusBadge}</td>
                <td class="p-3">
                    ${l.status === 'Active' ? `<button onclick="deleteLoan(${l.id})" class="text-red-400 hover:text-red-300 text-xs font-bold">🗑️</button>` : ''}
                </td>
            </tr>`;
    });
}

// ============================================================
// 6. TRANSACTIONS / REPORTS
// ============================================================
function addTransaction(data) {
    transactions.push({
        id: Date.now(),
        date: new Date().toISOString(),
        ...data
    });
    localStorage.setItem('fin_transactions', JSON.stringify(transactions));
}

function renderReports() {
    const filter = document.getElementById('reportFilter')?.value || 'all';
    const dateFrom = document.getElementById('reportDateFrom')?.value || '';
    const dateTo = document.getElementById('reportDateTo')?.value || '';
    
    let filtered = [...transactions];
    
    // Filter by type
    if (filter !== 'all') {
        filtered = filtered.filter(t => t.type === filter);
    }
    
    // Filter by date range
    if (dateFrom) {
        filtered = filtered.filter(t => t.date >= dateFrom);
    }
    if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setDate(endDate.getDate() + 1);
        filtered = filtered.filter(t => new Date(t.date) <= endDate);
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Update summary
    const totalDeposits = transactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawals = transactions.filter(t => t.type === 'withdraw').reduce((sum, t) => sum + t.amount, 0);
    const totalLoans = transactions.filter(t => t.type === 'loan').reduce((sum, t) => sum + t.amount, 0);
    
    document.getElementById('totalDeposits').textContent = totalDeposits.toLocaleString();
    document.getElementById('totalWithdrawals').textContent = totalWithdrawals.toLocaleString();
    document.getElementById('totalLoans').textContent = totalLoans.toLocaleString();
    
    // Render table
    const tbody = document.getElementById('reportTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="p-4 text-center text-slate-500">Ma jiraan transactions.</td></tr>`;
        document.getElementById('transactionCount').textContent = '0 transactions';
        return;
    }
    
    document.getElementById('transactionCount').textContent = `${filtered.length} transactions`;
    
    filtered.forEach((t, index) => {
        const typeLabels = {
            deposit: { en: 'Deposit', so: 'Ku Shub', color: 'text-emerald-400' },
            withdraw: { en: 'Withdrawal', so: 'La Bax', color: 'text-red-400' },
            loan: { en: 'Loan', so: 'Amaah', color: 'text-yellow-400' },
            repayment: { en: 'Repayment', so: 'Soo Celin', color: 'text-purple-400' }
        };
        
        const typeLabel = currentLang === 'en' ? typeLabels[t.type]?.en : typeLabels[t.type]?.so;
        const colorClass = typeLabels[t.type]?.color || 'text-slate-400';
        const dateDisplay = new Date(t.date).toLocaleString();
        const amountDisplay = isBalancesHidden ? '•••••' : t.amount.toLocaleString();
        const rowClass = `transaction-${t.type}`;
        
        tbody.innerHTML += `
            <tr class="border-b border-slate-700/40 text-xs ${rowClass}">
                <td class="p-3 text-slate-400">${index + 1}</td>
                <td class="p-3 text-white">${dateDisplay}</td>
                <td class="p-3 font-semibold ${colorClass}">${typeLabel}</td>
                <td class="p-3 text-slate-300">${t.account}</td>
                <td class="p-3 text-slate-300">${t.currency}</td>
                <td class="p-3 font-bold text-white">${amountDisplay}</td>
                <td class="p-3 text-slate-400">${t.description}</td>
            </tr>
        `;
    });
}

function clearReportFilters() {
    document.getElementById('reportFilter').value = 'all';
    document.getElementById('reportDateFrom').value = '';
    document.getElementById('reportDateTo').value = '';
    renderReports();
}

function clearTransactions() {
    if (!confirm("Are you sure wanto delete ALL Transections? this action can be undone!")) return;
    transactions = [];
    localStorage.setItem('fin_transactions', JSON.stringify(transactions));
    renderReports();
    alert("Deleted ALL transactions successful!");
}

// ============================================================
// 7. SETTINGS & MANAGEMENT
// ============================================================
function initProfileAndSettings() {
    const profileName = document.getElementById('profileName');
    const avatarCircle = document.getElementById('avatarCircle');
    const settingsName = document.getElementById('settingsName');
    const settingsRole = document.getElementById('settingsRole');
    
    if (profileName) profileName.innerText = profile.name;
    if (avatarCircle) avatarCircle.innerText = profile.name.charAt(0).toUpperCase();
    if (settingsName) settingsName.value = profile.name;
    if (settingsRole) settingsRole.value = profile.role;
    
    setLanguage(currentLang, false); 
    updateEyeIcon();
    
    // Update toggle state
    const toggle = document.getElementById('themeToggle');
    if (currentTheme === 'light') {
        if (toggle) toggle.classList.remove('active');
    } else {
        if (toggle) toggle.classList.add('active');
    }
}

function saveProfile() {
    const settingsName = document.getElementById('settingsName');
    const settingsRole = document.getElementById('settingsRole');
    const settingsNewPassword = document.getElementById('settingsNewPassword');
    
    profile.name = settingsName.value.trim() || profile.name;
    profile.role = settingsRole.value.trim() || profile.role;
    
    const newPass = settingsNewPassword.value.trim();
    if (newPass.length > 0) {
        const creds = getStoredCredentials();
        saveCredentials(creds.username, newPass);
        alert(currentLang === 'en' ? "Password updated!" : "Password-ka waa la cusboonaysiiyay!");
    }
    
    localStorage.setItem('fin_profile', JSON.stringify(profile)); 
    initProfileAndSettings();
    alert(currentLang === 'en' ? "Saved successful!" : "Waa la kaydiyay si guul leh!");
    resetSessionTimer();
}

function resetAllData() {
    if (!confirm("Are you sure wanto delete ALL the data? this action can be undone!")) return;
    localStorage.removeItem('fin_accounts');
    localStorage.removeItem('fin_loans');
    localStorage.removeItem('fin_transactions');
    accounts = JSON.parse(JSON.stringify(defaultAccounts));
    loans = [];
    transactions = [];
    saveToLocalStorage();
    localStorage.setItem('fin_transactions', JSON.stringify(transactions));
    syncDataUX();
    alert(" Deleted ALL the data successful!");
}

function clearLoans() {
    if (!confirm(" Are you sure wanto ALL the loans? this action can be undone!")) return;
    loans = [];
    saveToLocalStorage();
    syncDataUX();
    alert(" Delete ALL the loans successful!");
}

function setLanguage(lang, triggerAnimation = true) {
    const applyLang = () => {
        currentLang = lang; 
        localStorage.setItem('fin_lang', lang);
        const langBtnEn = document.getElementById('lang-btn-en');
        const langBtnSo = document.getElementById('lang-btn-so');
        if (langBtnEn) {
            langBtnEn.className = lang === 'en' ? 'flex-1 py-2 px-4 rounded-lg bg-emerald-600 text-white text-xs border border-emerald-500' : 'flex-1 py-2 px-4 rounded-lg bg-slate-900 text-slate-400 text-xs border border-slate-700';
        }
        if (langBtnSo) {
            langBtnSo.className = lang === 'so' ? 'flex-1 py-2 px-4 rounded-lg bg-emerald-600 text-white text-xs border border-emerald-500' : 'flex-1 py-2 px-4 rounded-lg bg-slate-900 text-slate-400 text-xs border border-slate-700';
        }
        document.querySelectorAll('[data-lang-en]').forEach(el => { 
            el.innerText = lang === 'en' ? el.getAttribute('data-lang-en') : el.getAttribute('data-lang-so'); 
        });
        updateClockAndGreeting();
        renderReports();
    };
    if(triggerAnimation) triggerLoadingAnimation(applyLang); 
    else applyLang();
}

function saveToLocalStorage() { 
    localStorage.setItem('fin_accounts', JSON.stringify(accounts)); 
    localStorage.setItem('fin_loans', JSON.stringify(loans)); 
}

function syncDataUX() { 
    renderDashboard(); 
    populateFormOptions(); 
    renderReports();
}

// ============================================================
// 8. CHECK SESSION ON LOAD
// ============================================================
(function() {
    if (isLoggedIn()) {
        showApp();
    } else {
        const loginPage = document.getElementById('loginPage');
        const appContainer = document.getElementById('appContainer');
        if (loginPage) loginPage.classList.remove('hidden');
        if (appContainer) appContainer.classList.add('hidden');
    }
})();