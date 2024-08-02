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

function addActivity() {
    const activity = document.getElementById('activity').value;
    const duration = document.getElementById('duration').value;
    const activityList = document.getElementById('activity-list');
    
    if (activity && duration) {
        const listItem = document.createElement('p');
        listItem.textContent = `${activity}: ${duration} minutes`;
        activityList.appendChild(listItem);

        document.getElementById('activity').value = '';
        document.getElementById('duration').value = '';
    }
}

let totalWaterIntake = 0;

function addWaterIntake() {
    const waterIntake = parseInt(document.getElementById('water-intake').value);
    const waterIntakeTotal = document.getElementById('water-intake-total');
    
    if (waterIntake) {
        totalWaterIntake += waterIntake;
        waterIntakeTotal.textContent = `Total water intake: ${totalWaterIntake} ml`;
        document.getElementById('water-intake').value = '';
    }
}