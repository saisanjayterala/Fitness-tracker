let currentUser = null;
let userData = {};

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    // In a real app, you would validate credentials against a backend
    if (username && password) {
        currentUser = username;
        loadUserData();
        updateUI();
    } else {
        alert('Please enter both username and password');
    }
}

function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    // In a real app, you would send this data to a backend for registration
    if (username && password) {
        currentUser = username;
        userData[username] = {
            bmiHistory: [],
            caloriesBurnedHistory: [],
            caloriesConsumedHistory: [],
            waterIntakeHistory: [],
            sleepHistory: []
        };
        saveUserData();
        updateUI();
    } else {
        alert('Please enter both username and password');
    }
}

function logout() {
    currentUser = null;
    updateUI();
}

function loadUserData() {
    const storedData = localStorage.getItem(currentUser);
    if (storedData) {
        userData[currentUser] = JSON.parse(storedData);
    } else {
        userData[currentUser] = {
            bmiHistory: [],
            caloriesBurnedHistory: [],
            caloriesConsumedHistory: [],
            waterIntakeHistory: [],
            sleepHistory: []
        };
    }
}

function saveUserData() {
    localStorage.setItem(currentUser, JSON.stringify(userData[currentUser]));
}

function updateUI() {
    const authSection = document.getElementById('user-auth');
    const profileSection = document.getElementById('user-profile');
    const loginForm = document.getElementById('login-form');
    const logoutButton = document.getElementById('logout-button');

    if (currentUser) {
        authSection.style.display = 'none';
        profileSection.style.display = 'block';
        logoutButton.style.display = 'block';
        updateProfileInfo();
    } else {
        authSection.style.display = 'block';
        profileSection.style.display = 'none';
        logoutButton.style.display = 'none';
    }
}

function updateProfileInfo() {
    const profileInfo = document.getElementById('profile-info');
    const userDataArray = userData[currentUser];
    const latestBMI = userDataArray.bmiHistory[userDataArray.bmiHistory.length - 1] || 'Not calculated';
    const totalCaloriesBurned = userDataArray.caloriesBurnedHistory[userDataArray.caloriesBurnedHistory.length - 1] || 0;
    const totalCaloriesConsumed = userDataArray.caloriesConsumedHistory[userDataArray.caloriesConsumedHistory.length - 1] || 0;

    profileInfo.innerHTML = `
        <p>Username: ${currentUser}</p>
        <p>Latest BMI: ${latestBMI}</p>
        <p>Total Calories Burned: ${totalCaloriesBurned}</p>
        <p>Total Calories Consumed: ${totalCaloriesConsumed}</p>
    `;
}

function calculateBMI() {
    if (!currentUser) {
        alert('Please log in to use this feature');
        return;
    }

    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value / 100;
    const bmi = weight / (height * height);
    const result = document.getElementById('bmi-result');
    
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
}

let totalCaloriesBurned = 0;

function addActivity() {
    if (!currentUser) {
        alert('Please log in to use this feature');
        return;
    }

    const activity = document.getElementById('activity').value;
    const duration = document.getElementById('duration').value;
    const activityList = document.getElementById('activity-list');
    const totalCaloriesElement = document.getElementById('total-calories');
    
    if (activity && duration) {
        const listItem = document.createElement('p');
        listItem.textContent = `${activity}: ${duration} minutes`;
        activityList.appendChild(listItem);

        // Simple calorie calculation (just an example, not accurate)
        const caloriesBurned = duration * 5;
        totalCaloriesBurned += caloriesBurned;

        totalCaloriesElement.textContent = `Total calories burned: ${totalCaloriesBurned}`;

        document.getElementById('activity').value = '';
        document.getElementById('duration').value = '';

        userData[currentUser].caloriesBurnedHistory.push(totalCaloriesBurned);
        saveUserData();
        updateProgressChart();
        updateProfileInfo();
    }
}

let totalWaterIntake = 0;

function addWaterIntake() {
    if (!currentUser) {
        alert('Please log in to use this feature');
        return;
    }

    const waterIntake = parseInt(document.getElementById('water-intake').value);
    const waterIntakeTotal = document.getElementById('water-intake-total');
    const hydrationStatus = document.getElementById('hydration-status');
    
    if (waterIntake) {
        totalWaterIntake += waterIntake;
        waterIntakeTotal.textContent = `Total water intake: ${totalWaterIntake} ml`;
        
        if (totalWaterIntake >= 2000) {
            hydrationStatus.textContent = "You're well hydrated!";
            hydrationStatus.style.color = "green";
        } else {
            hydrationStatus.textContent = "Drink more water!";
            hydrationStatus.style.color = "red";
        }

        document.getElementById('water-intake').value = '';

        userData[currentUser].waterIntakeHistory.push(totalWaterIntake);
        saveUserData();
    }
}

function assessSleep() {
    if (!currentUser) {
        alert('Please log in to use this feature');
        return;
    }

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

let totalCaloriesConsumed = 0;

function addFoodItem() {
    if (!currentUser) {
        alert('Please log in to use this feature');
        return;
    }

    const foodItem = document.getElementById('food-item').value;
    const calories = parseInt(document.getElementById('calories').value);
    const foodList = document.getElementById('food-list');
    const totalCaloriesConsumedElement = document.getElementById('total-calories-consumed');
    
    if (foodItem && calories) {
        const listItem = document.createElement('p');
        listItem.textContent = `${foodItem}: ${calories} calories`;
        foodList.appendChild(listItem);

        totalCaloriesConsumed += calories;
        totalCaloriesConsumedElement.textContent = `Total calories consumed: ${totalCaloriesConsumed}`;

        document.getElementById('food-item').value = '';
        document.getElementById('calories').value = '';

        userData[currentUser].caloriesConsumedHistory.push(totalCaloriesConsumed);
        saveUserData();
        updateProgressChart();
        updateProfileInfo();
    }
}

function getWorkout() {
    if (!currentUser) {
        alert('Please log in to use this feature');
        return;
    }

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

let progressChart;

function updateProgressChart() {
    if (!currentUser) {
        return;
    }

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

// Initialize the UI
updateUI();

// Event listeners for login and registration
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

// Load user data if there's a stored session
window.addEventListener('load', function() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = storedUser;
        loadUserData();
        updateUI();
        updateProgressChart();
    }
})