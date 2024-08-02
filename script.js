let currentUser = null;
let userData = {};
let totalCaloriesBurned = 0;
let totalWaterIntake = 0;
let totalCaloriesConsumed = 0;
let progressChart;

function toggleAuthMode() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
    registerForm.style.display = registerForm.style.display === 'none' ? 'block' : 'none';
}

function login() {
    try {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        console.log('Attempting login for username:', username);
        
        if (!username || !password) {
            throw new Error('Please enter both username and password');
        }
        
        if (!userData[username]) {
            throw new Error('Username not found');
        }
        
        if (userData[username].password !== password) {
            throw new Error('Incorrect password');
        }
        
        currentUser = username;
        localStorage.setItem('currentUser', currentUser);
        console.log('Login successful for user:', currentUser);
        
        loadUserData();
        initializeUserStats();
        updateUI();
        
        console.log('User data loaded and UI updated');
    } catch (error) {
        console.error('Login error:', error.message);
        alert(error.message);
    }
}
function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const email = document.getElementById('reg-email').value;
    if (username && password && email) {
        if (userData[username]) {
            alert('Username already exists');
        } else {
            userData[username] = {
                password: password,
                email: email,
                bmiHistory: [],
                caloriesBurnedHistory: [],
                caloriesConsumedHistory: [],
                waterIntakeHistory: [],
                sleepHistory: [],
                goals: {
                    weight: null,
                    steps: null,
                    calories: null
                }
            };
            currentUser = username;
            localStorage.setItem('currentUser', currentUser);
            saveUserData();
            initializeUserStats();
            updateUI();
            toggleAuthMode();
        }
    } else {
        alert('Please fill in all fields');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    totalCaloriesBurned = 0;
    totalWaterIntake = 0;
    totalCaloriesConsumed = 0;
    updateUI();
}

function loadUserData() {
    try {
        const storedData = localStorage.getItem('userData');
        console.log('Stored user data:', storedData);
        
        if (storedData) {
            userData = JSON.parse(storedData);
            console.log('Parsed user data:', userData);
        } else {
            console.log('No stored user data found');
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        alert('Error loading user data. Please try again.');
    }
}

function saveUserData() {
    localStorage.setItem('userData', JSON.stringify(userData));
}

function updateUI() {
    const authContainer = document.getElementById('auth-container');
    const appContainer = document.getElementById('app-container');

    if (currentUser) {
        authContainer.style.display = 'none';
        appContainer.style.display = 'block';
        updateProfileInfo();
        updateGoals();
        updateProgressChart();
    } else {
        authContainer.style.display = 'block';
        appContainer.style.display = 'none';
    }
}

function updateProfileInfo() {
    const profileInfo = document.getElementById('profile-details');
    const user = userData[currentUser];
    const latestBMI = user.bmiHistory[user.bmiHistory.length - 1] || 'Not calculated';
    const totalCaloriesBurned = user.caloriesBurnedHistory[user.caloriesBurnedHistory.length - 1] || 0;
    const totalCaloriesConsumed = user.caloriesConsumedHistory[user.caloriesConsumedHistory.length - 1] || 0;

    profileInfo.innerHTML = `
        <p>Username: ${currentUser}</p>
        <p>Email: ${user.email}</p>
        <p>Latest BMI: ${latestBMI}</p>
        <p>Total Calories Burned: ${totalCaloriesBurned}</p>
        <p>Total Calories Consumed: ${totalCaloriesConsumed}</p>
    `;
}

function setGoals() {
    const weightGoal = document.getElementById('weight-goal').value;
    const stepsGoal = document.getElementById('steps-goal').value;
    const caloriesGoal = document.getElementById('calories-goal').value;

    userData[currentUser].goals = {
        weight: weightGoal,
        steps: stepsGoal,
        calories: caloriesGoal
    };

    saveUserData();
    updateGoals();
}

function updateGoals() {
    const currentGoals = document.getElementById('current-goals');
    const goals = userData[currentUser].goals;

    let goalsHTML = '<h3>Current Goals</h3>';

    if (goals.weight) {
        const currentWeight = userData[currentUser].bmiHistory.length > 0 ? 
            userData[currentUser].bmiHistory[userData[currentUser].bmiHistory.length - 1] : 0;
        const weightProgress = Math.min(100, (currentWeight / goals.weight) * 100);
        goalsHTML += `
            <p>Weight Goal: ${goals.weight} kg</p>
            <div class="goal-progress">
                <div class="progress-bar" style="width: ${weightProgress}%"></div>
            </div>
        `;
    }

    if (goals.steps) {
        const currentSteps = userData[currentUser].stepsHistory ? 
            userData[currentUser].stepsHistory[userData[currentUser].stepsHistory.length - 1] : 0;
        const stepsProgress = Math.min(100, (currentSteps / goals.steps) * 100);
        goalsHTML += `
            <p>Daily Step Goal: ${goals.steps} steps</p>
            <div class="goal-progress">
                <div class="progress-bar" style="width: ${stepsProgress}%"></div>
            </div>
        `;
    }

    if (goals.calories) {
        const currentCalories = userData[currentUser].caloriesConsumedHistory.length > 0 ?
            userData[currentUser].caloriesConsumedHistory[userData[currentUser].caloriesConsumedHistory.length - 1] : 0;
        const caloriesProgress = Math.min(100, (currentCalories / goals.calories) * 100);
        goalsHTML += `
            <p>Daily Calorie Goal: ${goals.calories} calories</p>
            <div class="goal-progress">
                <div class="progress-bar" style="width: ${caloriesProgress}%"></div>
            </div>
        `;
    }

    currentGoals.innerHTML = goalsHTML;
}

function calculateBMI() {
    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value / 100;
    const bmi = weight / (height * height);
    const result = document.getElementById('bmi-result-modal');
    
    let category;
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal weight';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';

    result.innerHTML = `Your BMI is ${bmi.toFixed(2)}. Category: ${category}`;

    userData[currentUser].bmiHistory.push(bmi);
    saveUserData();
    updateProgressChart();
    updateProfileInfo();
    updateGoals();
}

function addActivity() {
    const activity = document.getElementById('activity').value;
    const duration = document.getElementById('duration').value;
    const activityList = document.getElementById('activity-list');
    
    if (activity && duration) {
        const listItem = document.createElement('p');
        listItem.textContent = `${activity}: ${duration} minutes`;
        activityList.appendChild(listItem);

        const caloriesBurned = duration * 5;
        totalCaloriesBurned += caloriesBurned;

        userData[currentUser].caloriesBurnedHistory.push(totalCaloriesBurned);
        saveUserData();
        updateTotalCaloriesBurned();
        updateProgressChart();
        updateProfileInfo();
        updateGoals();

        document.getElementById('activity').value = '';
        document.getElementById('duration').value = '';
    }
}

function addWaterIntake() {
    const waterIntake = parseInt(document.getElementById('water-intake').value);
    const hydrationStatus = document.getElementById('hydration-status');
    
    if (waterIntake) {
        totalWaterIntake += waterIntake;
        
        if (totalWaterIntake >= 2000) {
            hydrationStatus.textContent = "You're well hydrated!";
            hydrationStatus.style.color = "green";
        } else {
            hydrationStatus.textContent = "Drink more water!";
            hydrationStatus.style.color = "red";
        }

        userData[currentUser].waterIntakeHistory.push(totalWaterIntake);
        saveUserData();
        updateTotalWaterIntake();

        document.getElementById('water-intake').value = '';
    }
}

function assessSleep() {
    const sleepDuration = document.getElementById('sleep-duration').value;
    const sleepQuality = document.getElementById('sleep-quality').value;
    const sleepResult = document.getElementById('sleep-result');

    if (sleepDuration && sleepQuality) {
        let advice = "";

        if (sleepDuration < 7) {
            advice = "Try to get at least 7 hours of sleep for better health.";
        } else if (sleepDuration > 9) {
            advice = "You might be oversleeping. Aim for 7-9 hours of sleep.";
        } else {
            advice = "Your sleep duration is good!";
        }

        if (sleepQuality === "poor" || sleepQuality === "fair") {
            advice += " To improve sleep quality, maintain a consistent sleep schedule and create a relaxing bedtime routine.";
        }

        sleepResult.textContent = `Sleep duration: ${sleepDuration} hours. Sleep quality: ${sleepQuality}. ${advice}`;

        userData[currentUser].sleepHistory.push({duration: sleepDuration, quality: sleepQuality});
        saveUserData();
    }
}

function addFoodItem() {
    const foodItem = document.getElementById('food-item').value;
    const calories = parseInt(document.getElementById('calories').value);
    const foodList = document.getElementById('food-list');
    
    if (foodItem && calories) {
        const listItem = document.createElement('p');
        listItem.textContent = `${foodItem}: ${calories} calories`;
        foodList.appendChild(listItem);

        totalCaloriesConsumed += calories;

        userData[currentUser].caloriesConsumedHistory.push(totalCaloriesConsumed);
        saveUserData();
        updateTotalCaloriesConsumed();
        updateProgressChart();
        updateProfileInfo();
        updateGoals();

        document.getElementById('food-item').value = '';
        document.getElementById('calories').value = '';
    }
}

function getWorkout() {
    const workoutType = document.getElementById('workout-type').value;
    const workoutPlan = document.getElementById('workout-plan');
    
    if (workoutType) {
        let exercises;
        switch (workoutType) {
            case 'full-body':
                exercises = [
                    'Squats: 3 sets of 12 reps',
                    'Push-ups: 3 sets of 10 reps',
                    'Lunges: 3 sets of 10 reps per leg',
                    'Dumbbell rows: 3 sets of 12 reps',
                    'Plank: 3 sets of 30 seconds'
                ];
                break;
            case 'upper-body':
                exercises = [
                    'Bench press: 3 sets of 10 reps',
                    'Pull-ups or lat pulldowns: 3 sets of 8 reps',
                    'Shoulder press: 3 sets of 10 reps',
                    'Bicep curls: 3 sets of 12 reps',
                    'Tricep dips: 3 sets of 12 reps'
                ];
                break;
            case 'lower-body':
                exercises = [
                    'Squats: 4 sets of 12 reps',
                    'Deadlifts: 3 sets of 10 reps',
                    'Leg press: 3 sets of 12 reps',
                    'Calf raises: 3 sets of 15 reps',
                    'Leg curls: 3 sets of 12 reps'
                ];
                break;
            case 'cardio':
                exercises = [
                    'Jumping jacks: 3 sets of 1 minute',
                    'High knees: 3 sets of 1 minute',
                    'Burpees: 3 sets of 10 reps',
                    'Mountain climbers: 3 sets of 1 minute',
                    'Jump rope: 3 sets of 2 minutes'
                ];
                break;
        }

        workoutPlan.innerHTML = `<h3>${workoutType.charAt(0).toUpperCase() + workoutType.slice(1)} Workout</h3>`;
        const ul = document.createElement('ul');
        exercises.forEach(exercise => {
            const li = document.createElement('li');
            li.textContent = exercise;
            ul.appendChild(li);
        });
        workoutPlan.appendChild(ul);
    }
}

function updateProgressChart() {
    const ctx = document.getElementById('progress-chart').getContext('2d');
    
    if (progressChart) {
        progressChart.destroy();
    }

    const userDataArray = userData[currentUser];

    progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: Math.max(userDataArray.bmiHistory.length, userDataArray.caloriesBurnedHistory.length, userDataArray.caloriesConsumedHistory.length)}, (_, i) => i + 1),
            datasets: [{
                label: 'BMI',
                data: userDataArray.bmiHistory,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }, {
                label: 'Calories Burned',
                data: userDataArray.caloriesBurnedHistory,
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            }, {
                label: 'Calories Consumed',
                data: userDataArray.caloriesConsumedHistory,
                borderColor: 'rgb(54, 162, 235)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function showBMICalculator() {
    const modal = document.getElementById('bmi-modal');
    modal.style.display = 'block';
}

function switchSection(sectionId) {
    const sections = document.querySelectorAll('main > section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

function handleNavigation() {
    const hash = window.location.hash;
    if (hash) {
        const sectionId = hash.substring(1);
        switchSection(sectionId);
    }
}


function updateTotalCaloriesBurned() {
    const totalCaloriesElement = document.getElementById('calories-burned');
    totalCaloriesElement.textContent = `Total calories burned: ${totalCaloriesBurned}`;
}

function updateTotalWaterIntake() {
    const waterIntakeTotal = document.getElementById('water-intake-total');
    waterIntakeTotal.textContent = `Total water intake: ${totalWaterIntake} ml`;
}

function updateTotalCaloriesConsumed() {
    const totalCaloriesConsumedElement = document.getElementById('total-calories-consumed');
    totalCaloriesConsumedElement.textContent = `Total calories consumed: ${totalCaloriesConsumed}`;
}

function initializeUserStats() {
    if (currentUser && userData[currentUser]) {
        const user = userData[currentUser];
        totalCaloriesBurned = user.caloriesBurnedHistory[user.caloriesBurnedHistory.length - 1] || 0;
        totalWaterIntake = user.waterIntakeHistory[user.waterIntakeHistory.length - 1] || 0;
        totalCaloriesConsumed = user.caloriesConsumedHistory[user.caloriesConsumedHistory.length - 1] || 0;
        
        updateTotalCaloriesBurned();
        updateTotalWaterIntake();
        updateTotalCaloriesConsumed();
    }
}

function handleError(error) {
    console.error('An error occurred:', error);
    alert('An error occurred. Please try again.');
}

function safelyExecute(func) {
    return function(...args) {
        try {
            func.apply(this, args);
        } catch (error) {
            handleError(error);
        }
    }
}

// Apply safelyExecute to all main functions
login = safelyExecute(login);
register = safelyExecute(register);
logout = safelyExecute(logout);
calculateBMI = safelyExecute(calculateBMI);
addActivity = safelyExecute(addActivity);
addWaterIntake = safelyExecute(addWaterIntake);
assessSleep = safelyExecute(assessSleep);
addFoodItem = safelyExecute(addFoodItem);
getWorkout = safelyExecute(getWorkout);
setGoals = safelyExecute(setGoals);

window.addEventListener('load', function() {
    loadUserData();
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = storedUser;
        initializeUserStats();
        updateUI();
    }
    handleNavigation();
});
window.addEventListener('hashchange', handleNavigation);

document.getElementById('username').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        login();
    }
});

document.getElementById('password').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        login();
    }
});

document.getElementById('reg-username').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        register();
    }
});

document.getElementById('reg-password').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        register();
    }
});

document.getElementById('reg-email').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        register();
    }
});

document.getElementById('logout-btn').addEventListener('click', logout);
document.querySelector('button[onclick="calculateBMI()"]').addEventListener('click', calculateBMI);
document.querySelector('button[onclick="addActivity()"]').addEventListener('click', addActivity);
document.querySelector('button[onclick="addWaterIntake()"]').addEventListener('click', addWaterIntake);
document.querySelector('button[onclick="assessSleep()"]').addEventListener('click', assessSleep);
document.querySelector('button[onclick="addFoodItem()"]').addEventListener('click', addFoodItem);
document.querySelector('button[onclick="getWorkout()"]').addEventListener('click', getWorkout);
document.querySelector('button[onclick="setGoals()"]').addEventListener('click', setGoals);

document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const sectionId = this.getAttribute('href').substring(1);
        switchSection(sectionId);
    });
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('bmi-modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Close modal when clicking on close button
document.querySelector('.close').onclick = function() {
    document.getElementById('bmi-modal').style.display = 'none';
}

// Initialize the first section (Dashboard) as active
switchSection('dashboard');

// Initialize the app
loadUserData();
updateUI();