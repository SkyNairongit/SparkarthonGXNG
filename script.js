// script.js

// In-memory queue data structure: { counterNumber: [ {id, products, estimate}, ... ] }
let queues = JSON.parse(localStorage.getItem('queues')) || {};
let timers = {}; // Store active timers for each counter
let currentServing = {}; // Track who is currently being served at each counter
let pausedCounters = {};

// Initialize empty queues for all counters
for (let i = 1; i <= 10; i++) {
    if (!queues[i]) queues[i] = [];
    if (!currentServing[i]) currentServing[i] = null;
}

function saveQueues() {
    localStorage.setItem('queues', JSON.stringify(queues));
}

function startTimer(counter) {
    if (timers[counter]) clearInterval(timers[counter]);
    if (pausedCounters[counter]) return; // Don't start if paused

    if (queues[counter] && queues[counter].length > 0) {
        let currentCustomer = queues[counter][0];
        currentServing[counter] = currentCustomer.estimate;

        timers[counter] = setInterval(() => {
            if (pausedCounters[counter]) return; // Skip if paused
            if (currentServing[counter] > 0) {
                currentServing[counter]--;
                updateTimerDisplay();
            } else {
                queues[counter].shift();
                saveQueues();
                if (queues[counter].length > 0) {
                    startTimer(counter);
                } else {
                    currentServing[counter] = null;
                    clearInterval(timers[counter]);
                    timers[counter] = null;
                }
                updateTimerDisplay();
            }
        }, 1000);
    }
}

function updateTimerDisplay() {
    let ul = document.getElementById('counter-times');
    if (ul) {
        ul.innerHTML = '';
        for (let counter = 1; counter <= 10; counter++) {
            let totalTime = 0;
            let currentTime = currentServing[counter] || 0;
            if (queues[counter]) {
                for (let i = 1; i < queues[counter].length; i++) {
                    totalTime += queues[counter][i].products * 3 + 90;
                }
            }
            let li = document.createElement('li');
            if (currentTime > 0) {
                li.innerHTML = `<strong>Counter ${counter}:</strong> Serving customer (${currentTime}s left) | Queue wait: ${totalTime}s`;
                li.style.backgroundColor = '#ffeb3b';
                if (pausedCounters[counter]) {
                    let delayMsg = document.createElement('div');
                    delayMsg.textContent = 'May take longer than estimated';
                    delayMsg.style.color = 'red';
                    delayMsg.style.fontWeight = 'bold';
                    li.appendChild(delayMsg);
                }
            } else {
                li.innerHTML = `<strong>Counter ${counter}:</strong> Available | Queue wait: ${totalTime}s`;
                li.style.backgroundColor = totalTime > 0 ? '#ffcdd2' : '#c8e6c9';
            }
            ul.appendChild(li);
        }
    }
}


function showCustomer() {
    document.getElementById('role-selection').style.display = 'none';
    document.getElementById('customer-section').style.display = 'block';
}

function showEmployee() {
    document.getElementById('role-selection').style.display = 'none';
    document.getElementById('employee-section').style.display = 'block';
}

function backToRole() {
    document.getElementById('customer-section').style.display = 'none';
    document.getElementById('employee-section').style.display = 'none';
    document.getElementById('role-selection').style.display = 'block';
    hideCustomerQueue();
    hideJoinCounter();
    hideEmployeeQueue();
}

function showCustomerQueue() {
    document.getElementById('customer-queue').style.display = 'block';
    document.getElementById('join-counter').style.display = 'none';
    updateTimerDisplay();
    
    // Start timers for all counters that have customers but no active timer
    for (let counter = 1; counter <= 10; counter++) {
        if (queues[counter] && queues[counter].length > 0 && !timers[counter]) {
            startTimer(counter);
        }
    }
}

function hideCustomerQueue() {
    document.getElementById('customer-queue').style.display = 'none';
}

function showJoinCounter() {
    document.getElementById('join-counter').style.display = 'block';
    document.getElementById('customer-queue').style.display = 'none';
    document.getElementById('your-estimate').textContent = '';
}

function hideJoinCounter() {
    document.getElementById('join-counter').style.display = 'none';
}

function joinCounter(event) {
    event.preventDefault();
    let counter = document.getElementById('counter-number').value;
    let products = parseInt(document.getElementById('num-products').value);
    let estimate = products * 3 + 90;
    if (!queues[counter]) queues[counter] = [];
    let id = Date.now();
    queues[counter].push({ id, products, estimate });
    saveQueues();
    
    // If this is the first customer and no one is being served, start the timer
    if (queues[counter].length === 1 && !currentServing[counter]) {
        startTimer(counter);
    }
    
    // Calculate total estimated time ahead in queue
    let index = queues[counter].length - 1;
    let timeAhead = currentServing[counter] || 0;
    for (let i = 0; i < index; i++) {
        timeAhead += queues[counter][i].products * 3 + 90;
    }
    document.getElementById('your-estimate').textContent =
        `You are added to Counter ${counter}. Estimated wait time: ${timeAhead} seconds before your turn.`;
}

function showEmployeeQueue(event) {
    event.preventDefault();
    let counter = document.getElementById('emp-counter-number').value;
    document.getElementById('employee-queue').style.display = 'block';
    document.getElementById('emp-counter-label').textContent = counter;
    let ul = document.getElementById('emp-queue-list');
    ul.innerHTML = '';

    if (currentServing[counter]) {
        let li = document.createElement('li');
        li.innerHTML = `<strong>Currently Serving:</strong> ${currentServing[counter]}s remaining`;
        li.style.backgroundColor = '#ffeb3b';
        ul.appendChild(li);
    }

    if (!queues[counter] || queues[counter].length === 0) {
        let li = document.createElement('li');
        li.textContent = 'No customers in queue.';
        ul.appendChild(li);
        return;
    }

    queues[counter].forEach((person, idx) => {
        let li = document.createElement('li');
        let status = idx === 0 ? ' (Being Served)' : '';
        li.textContent = `Customer ${idx + 1}: ${person.products} products, Est. time: ${person.estimate}s${status}`;

        if (idx === 0) {
            // Add Pause/Resume button for current customer
            let pauseBtn = document.createElement('button');
            pauseBtn.textContent = pausedCounters[counter] ? 'Resume' : 'Pause';
            pauseBtn.onclick = function() {
                if (pausedCounters[counter]) {
                    pausedCounters[counter] = false;
                    startTimer(counter);
                } else {
                    pausedCounters[counter] = true;
                    if (timers[counter]) {
                        clearInterval(timers[counter]);
                        timers[counter] = null;
                    }
                    updateTimerDisplay();
                }
                showEmployeeQueue({ preventDefault: () => {} });
            };
            li.appendChild(pauseBtn);
        }

        // Add Complete Service button
        let completeBtn = document.createElement('button');
        completeBtn.textContent = 'Complete Service';
        completeBtn.onclick = function() {
            if (timers[counter]) {
                clearInterval(timers[counter]);
                timers[counter] = null;
            }
            currentServing[counter] = null;
            pausedCounters[counter] = false;
            queues[counter].splice(idx, 1);
            saveQueues();
            if (queues[counter].length > 0) {
                startTimer(counter);
            }
            showEmployeeQueue({ preventDefault: () => {} });
        };
        li.appendChild(completeBtn);
        ul.appendChild(li);
    });
}


function hideEmployeeQueue() {
    document.getElementById('employee-queue').style.display = 'none';
}

// Initialize timers on page load
window.onload = function() {
    for (let counter = 1; counter <= 10; counter++) {
    if (!pausedCounters[counter]) pausedCounters[counter] = false;
    if (queues[counter] && queues[counter].length > 0 && !timers[counter] && !pausedCounters[counter]) {
        startTimer(counter);
    }
}

};
