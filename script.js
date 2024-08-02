function calculateBMI() {
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
}

let totalCaloriesBurned = 0;

function addActivity() {
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
    }
}

let totalWaterIntake = 0;

function addWaterIntake() {
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
    }
}

let totalCaloriesConsumed = 0;

function addFoodItem() {
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
    }
}