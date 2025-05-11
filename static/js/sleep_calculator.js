// Sleep Calculator JavaScript with Stress Level Impact

document.addEventListener('DOMContentLoaded', function() {
    // Get all the necessary elements
    const calculateWakeTimeBtn = document.getElementById('calculate-wake-time');
    const calculateBedTimeBtn = document.getElementById('calculate-bed-time');
    const wakeUpTab = document.getElementById('wake-up-tab');
    const sleepTab = document.getElementById('sleep-tab');
    const resultsContainer = document.getElementById('results-container');
    const ageRangeButtons = document.querySelectorAll('.age-range-btn');
    const stressLevelSlider = document.getElementById('stress-level');
    const sliderValue = document.querySelector('.slider-value');
    const fallAsleepTimeSelect = document.getElementById('fall-asleep-time');
    
    // Input fields
    const sleepHourSelect = document.getElementById('sleep-hour');
    const sleepMinuteSelect = document.getElementById('sleep-minute');
    const sleepAmPmSelect = document.getElementById('sleep-ampm');
    const wakeHourSelect = document.getElementById('wake-hour');
    const wakeMinuteSelect = document.getElementById('wake-minute');
    const wakeAmPmSelect = document.getElementById('wake-ampm');
    
    // Input sections
    const sleepTimeInput = document.querySelector('.sleep-time-input');
    const wakeTimeInput = document.querySelector('.wake-time-input');
    
    // Setup default values and states
    let selectedMode = 'wake-up'; // 'wake-up' or 'sleep'
    let selectedAge = '18-25'; // Default age range
    let stressLevel = 5; // Default stress level (1-10)
    let fallAsleepTime = 15; // Default time to fall asleep in minutes
    
    // Base sleep duration recommendations by age (in minutes)
    const baseSleepDurations = {
        '10-13': 600, // 10 hours
        '14-17': 540, // 9 hours
        '18-25': 480, // 8 hours
        '26-35': 480, // 8 hours
        '36-45': 420, // 7 hours
        '46-55': 420, // 7 hours
        '56-64': 420, // 7 hours
        '65+': 420, // 7 hours
    };
    
    // Sleep cycle duration in minutes (average)
    const sleepCycleDuration = 90;
    
    // Setup event listeners for tabs
    if (wakeUpTab) {
        wakeUpTab.addEventListener('click', function() {
            selectTab('wake-up');
        });
    }
    
    if (sleepTab) {
        sleepTab.addEventListener('click', function() {
            selectTab('sleep');
        });
    }
    
    function selectTab(mode) {
    selectedMode = mode;

    if (mode === 'wake-up') {
        if (wakeUpTab) wakeUpTab.classList.add('active');
        if (sleepTab) sleepTab.classList.remove('active');

        // Show/hide relevant time inputs
        if (sleepTimeInput) sleepTimeInput.style.display = 'flex';
        if (wakeTimeInput) wakeTimeInput.style.display = 'none';

        if (calculateWakeTimeBtn) calculateWakeTimeBtn.style.display = 'block';
        if (calculateBedTimeBtn) calculateBedTimeBtn.style.display = 'none';
    } else {
        if (wakeUpTab) wakeUpTab.classList.remove('active');
        if (sleepTab) sleepTab.classList.add('active');

        // Show/hide relevant time inputs
        if (sleepTimeInput) sleepTimeInput.style.display = 'none';
        if (wakeTimeInput) wakeTimeInput.style.display = 'flex';

        if (calculateWakeTimeBtn) calculateWakeTimeBtn.style.display = 'none';
        if (calculateBedTimeBtn) calculateBedTimeBtn.style.display = 'block';
    }

    // Toggle icon visibility
    document.querySelectorAll('.calculator-tab').forEach(tab => {
        const isActive = tab.classList.contains('active');
        const activeIcon = tab.querySelector('.active-icon');
        const inactiveIcon = tab.querySelector('.inactive-icon');

        if (activeIcon) activeIcon.style.display = isActive ? 'inline' : 'none';
        if (inactiveIcon) inactiveIcon.style.display = isActive ? 'none' : 'inline';
    });

    // Clear results when switching tabs
    if (resultsContainer) resultsContainer.innerHTML = '';
}

    
    // Setup age range selection
    if (ageRangeButtons) {
        ageRangeButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                ageRangeButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to selected button
                this.classList.add('active');
                
                // Update selected age range
                selectedAge = this.dataset.age;
            });
        });
    }
    
    // Setup stress level slider
    if (stressLevelSlider && sliderValue) {
        // Set initial value
        sliderValue.textContent = stressLevelSlider.value;
        
        // Update when slider changes
        stressLevelSlider.addEventListener('input', function() {
            stressLevel = parseInt(this.value);
            sliderValue.textContent = this.value;
            
            // Update the slider background color based on stress level
            let color;
            if (this.value <= 3) {
                color = '#27ae60'; // Low stress - green
            } else if (this.value <= 6) {
                color = '#f39c12'; // Medium stress - yellow/orange
            } else {
                color = '#e74c3c'; // High stress - red
            }
            
            // Apply gradient to slider
            const percentage = ((this.value - this.min) / (this.max - this.min)) * 100;
            this.style.background = `linear-gradient(to right, ${color} 0%, ${color} ${percentage}%, #e0e0e0 ${percentage}%, #e0e0e0 100%)`;
        });
        
        // Trigger input event to set initial gradient
        const event = new Event('input');
        stressLevelSlider.dispatchEvent(event);
    }
    
    // Setup fall asleep time selection
    if (fallAsleepTimeSelect) {
        fallAsleepTimeSelect.addEventListener('change', function() {
            fallAsleepTime = parseInt(this.value);
        });
    }
    
    // Calculate wake-up time based on bedtime
    if (calculateWakeTimeBtn) {
        calculateWakeTimeBtn.addEventListener('click', function() {
            // Get input values
            let sleepHour, sleepMinute, sleepAmPm;
            
            if (sleepHourSelect && sleepMinuteSelect && sleepAmPmSelect) {
                sleepHour = parseInt(sleepHourSelect.value);
                sleepMinute = parseInt(sleepMinuteSelect.value);
                sleepAmPm = sleepAmPmSelect.value;
            }
            
            // Validate inputs
            if (isNaN(sleepHour) || isNaN(sleepMinute)) {
                alert('Please enter valid hour and minute values');
                console.log('Invalid input: hour =', sleepHour, 'minute =', sleepMinute);
                return;
            }
            
            // Calculate wake-up times
            const wakeUpTimes = calculateWakeUpTimes(sleepHour, sleepMinute, sleepAmPm);
            
            // Display results
            displayWakeUpResults(wakeUpTimes);
        });
    }
    
    // Calculate bedtime based on wake-up time
    if (calculateBedTimeBtn) {
        calculateBedTimeBtn.addEventListener('click', function() {
            // Get input values
            let wakeHour, wakeMinute, wakeAmPm;
            
            if (wakeHourSelect && wakeMinuteSelect && wakeAmPmSelect) {
                wakeHour = parseInt(wakeHourSelect.value);
                wakeMinute = parseInt(wakeMinuteSelect.value);
                wakeAmPm = wakeAmPmSelect.value;
            }
            
            // Validate inputs
            if (isNaN(wakeHour) || isNaN(wakeMinute)) {
                alert('Please enter valid hour and minute values');
                console.log('Invalid input: hour =', wakeHour, 'minute =', wakeMinute);
                return;
            }
            
            // Calculate bedtimes
            const bedTimes = calculateBedTimes(wakeHour, wakeMinute, wakeAmPm);
            
            // Display results
            displayBedTimeResults(bedTimes);
        });
    }
    
    // Get adjusted time to fall asleep based on stress level
    function getAdjustedFallAsleepTime() {
        // Stress level 1-3: slight reduction
        // Stress level 4-6: no change
        // Stress level 7-8: slight increase
        // Stress level 9-10: significant increase
        let adjustment = 0;
        
        if (stressLevel <= 3) {
            adjustment = -5; // Easier to fall asleep when very relaxed
        } else if (stressLevel >= 7 && stressLevel <= 8) {
            adjustment = 10; // Harder to fall asleep when stressed
        } else if (stressLevel >= 9) {
            adjustment = 20; // Much harder to fall asleep when very stressed
        }
        
        // Ensure minimum of 5 minutes
        return Math.max(5, fallAsleepTime + adjustment);
    }
    
    // Get recommended sleep duration based on age and stress level
    function getRecommendedSleepDuration() {
        const baseDuration = baseSleepDurations[selectedAge];
        
        // Add extra sleep time when stressed
        let extraMinutes = 0;
        
        if (stressLevel >= 7 && stressLevel <= 8) {
            extraMinutes = 30; // Add 30 minutes for moderate-high stress
        } else if (stressLevel >= 9) {
            extraMinutes = 60; // Add an hour for very high stress
        }
        
        return baseDuration + extraMinutes;
    }
    
    // Calculate wake-up times based on bedtime
    function calculateWakeUpTimes(hour, minute, amPm) {
        // Get adjusted fall asleep time based on stress level
        const adjustedFallAsleepTime = getAdjustedFallAsleepTime();
        
        // Convert to 24-hour format
        let hour24 = hour;
        if (amPm === 'PM' && hour < 12) {
            hour24 += 12;
        } else if (amPm === 'AM' && hour === 12) {
            hour24 = 0;
        }
        
        // Get bedtime in minutes since midnight
        const bedTimeMinutes = hour24 * 60 + minute;
        
        // Add time to fall asleep (adjusted for stress)
        let sleepStartMinutes = bedTimeMinutes + adjustedFallAsleepTime;
        
        // Keep within 24 hours
        sleepStartMinutes = sleepStartMinutes % (24 * 60);
        
        // Calculate wake-up times for different numbers of sleep cycles
        const wakeUpTimes = [];
        
        // Calculate recommended cycles based on age and stress
        const recommendedSleepTime = getRecommendedSleepDuration();
        const recommendedCycles = Math.round(recommendedSleepTime / sleepCycleDuration);
        
        // Calculate for 4, 5, and 6 full cycles
        for (let cycles = 4; cycles <= 6; cycles++) {
            let wakeTimeMinutes = sleepStartMinutes + (cycles * sleepCycleDuration);
            
            // Adjust for crossing midnight
            wakeTimeMinutes = wakeTimeMinutes % (24 * 60);
            
            // Convert to hours and minutes
            const wakeHour = Math.floor(wakeTimeMinutes / 60);
            const wakeMinute = wakeTimeMinutes % 60;
            
            // Convert to 12-hour format
            let wakeHour12 = wakeHour % 12;
            if (wakeHour12 === 0) wakeHour12 = 12;
            const wakeAmPm = wakeHour >= 12 ? 'PM' : 'AM';
            
            // Format minutes with leading zero if needed
            const formattedMinutes = wakeMinute < 10 ? `0${wakeMinute}` : wakeMinute;
            
            // Determine if this is the recommended option
            const isRecommended = cycles === recommendedCycles;
            
            // Add sleep quality rating based on stress level and cycles
            let qualityRating = getQualityRating(cycles, recommendedCycles);
            
            // Add to results
            wakeUpTimes.push({
                time: `${wakeHour12}:${formattedMinutes} ${wakeAmPm}`,
                cycles: cycles,
                recommended: isRecommended,
                quality: qualityRating
            });
        }
        
        return wakeUpTimes;
    }
    
    // Calculate bedtimes based on wake-up time
    function calculateBedTimes(hour, minute, amPm) {
        // Get adjusted fall asleep time based on stress level
        const adjustedFallAsleepTime = getAdjustedFallAsleepTime();
        
        // Convert to 24-hour format
        let hour24 = hour;
        if (amPm === 'PM' && hour < 12) {
            hour24 += 12;
        } else if (amPm === 'AM' && hour === 12) {
            hour24 = 0;
        }
        
        // Get wake-up time in minutes since midnight
        const wakeUpMinutes = hour24 * 60 + minute;
        
        // Calculate bedtimes for different numbers of sleep cycles
        const bedTimes = [];
        
        // Calculate recommended cycles based on age and stress
        const recommendedSleepTime = getRecommendedSleepDuration();
        const recommendedCycles = Math.round(recommendedSleepTime / sleepCycleDuration);
        
        // Calculate for 4, 5, and 6 full cycles
        for (let cycles = 6; cycles >= 4; cycles--) {
            // Calculate bedtime (wake-up time minus sleep duration and time to fall asleep)
            let bedTimeMinutes = wakeUpMinutes - (cycles * sleepCycleDuration) - adjustedFallAsleepTime;
            
            // Adjust for crossing midnight
            if (bedTimeMinutes < 0) {
                bedTimeMinutes += 24 * 60;
            }
            
            // Convert to hours and minutes
            const bedHour = Math.floor(bedTimeMinutes / 60);
            const bedMinute = bedTimeMinutes % 60;
            
            // Convert to 12-hour format
            let bedHour12 = bedHour % 12;
            if (bedHour12 === 0) bedHour12 = 12;
            const bedAmPm = bedHour >= 12 ? 'PM' : 'AM';
            
            // Format minutes with leading zero if needed
            const formattedMinutes = bedMinute < 10 ? `0${bedMinute}` : bedMinute;
            
            // Determine if this is the recommended option
            const isRecommended = cycles === recommendedCycles;
            
            // Add sleep quality rating based on stress level and cycles
            let qualityRating = getQualityRating(cycles, recommendedCycles);
            
            // Add to results
            bedTimes.push({
                time: `${bedHour12}:${formattedMinutes} ${bedAmPm}`,
                cycles: cycles,
                recommended: isRecommended,
                quality: qualityRating
            });
        }
        
        return bedTimes;
    }
    
    // Get sleep quality rating based on stress level and cycles
    function getQualityRating(cycles, recommendedCycles) {
        // Base quality on how close we are to recommended cycles
        let qualityScore = 5; // Base score out of 10
        
        // Adjust based on proximity to recommended cycles
        if (cycles === recommendedCycles) {
            qualityScore = 10;
        } else if (Math.abs(cycles - recommendedCycles) === 1) {
            qualityScore = 7;
        }
        
        // Adjust for stress level
        if (stressLevel >= 8) {
            qualityScore = Math.max(3, qualityScore - 3); // High stress lowers quality
        } else if (stressLevel <= 3) {
            qualityScore = Math.min(10, qualityScore + 1); // Low stress improves quality
        }
        
        // Convert score to descriptive rating
        if (qualityScore >= 9) return "Optimal";
        if (qualityScore >= 7) return "Good";
        if (qualityScore >= 5) return "Adequate";
        if (qualityScore >= 3) return "Fair";
        return "Poor";
    }
    
    // Get a descriptive message about stress impact
    function getStressImpactMessage() {
        if (stressLevel >= 9) {
            return "Your high stress level is significantly impacting sleep quality. Consider relaxation techniques before bed.";
        } else if (stressLevel >= 7) {
            return "Your elevated stress may disrupt sleep. We've adjusted recommendations to compensate.";
        } else if (stressLevel <= 3) {
            return "Your low stress level should help you achieve restful sleep.";
        }
        return "";
    }
    
    // Display wake-up time results
    function displayWakeUpResults(wakeUpTimes) {
        // Clear previous results
        if (!resultsContainer) return;
        resultsContainer.innerHTML = '';
        
        // Create results container
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'results';
        
        // Find recommended time
        const recommendedOption = wakeUpTimes.find(t => t.recommended) || wakeUpTimes[1];
        
        // Get stress impact message
        const stressMessage = getStressImpactMessage();
        const stressMessageHtml = stressMessage ? `<p class="stress-message">${stressMessage}</p>` : '';
        
        resultsDiv.innerHTML = `
            <h2>Your Recommended Wake-Up Times</h2>
            <div class="time-options"></div>
            <p class="recommendation-note">Based on your personal adjustments, waking up at ${recommendedOption.time} will give you the most restful sleep.</p>
            ${stressMessageHtml}
        `;
        
        // Add to DOM
        resultsContainer.appendChild(resultsDiv);
        
        // Get the time options container
        const timeOptionsContainer = resultsDiv.querySelector('.time-options');
        
        // Add each option
        wakeUpTimes.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.className = `time-option ${option.recommended ? 'recommended' : ''}`;
            optionDiv.innerHTML = `
                <h3>${option.time}</h3>
                <p>${option.cycles} complete cycles</p>
                <p class="quality-rating">Sleep Quality: <span class="quality-${option.quality.toLowerCase()}">${option.quality}</span></p>
                ${option.recommended ? '<p class="recommended-label">Recommended</p>' : ''}
            `;
            timeOptionsContainer.appendChild(optionDiv);
        });
    }
    
    // Display bedtime results
    function displayBedTimeResults(bedTimes) {
        // Clear previous results
        if (!resultsContainer) return;
        resultsContainer.innerHTML = '';
        
        // Create results container
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'results';
        
        // Find recommended time
        const recommendedOption = bedTimes.find(t => t.recommended) || bedTimes[1];
        
        // Get stress impact message
        const stressMessage = getStressImpactMessage();
        const stressMessageHtml = stressMessage ? `<p class="stress-message">${stressMessage}</p>` : '';
        
        resultsDiv.innerHTML = `
            <h2>Your Recommended Bed Times</h2>
            <div class="time-options"></div>
            <p class="recommendation-note">Based on your personal adjustments, ${recommendedOption.time} gives you the best sleep quality.</p>
            ${stressMessageHtml}
        `;
        
        // Add to DOM
        resultsContainer.appendChild(resultsDiv);
        
        // Get the time options container
        const timeOptionsContainer = resultsDiv.querySelector('.time-options');
        
        // Add each option
        bedTimes.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.className = `time-option ${option.recommended ? 'recommended' : ''}`;
            optionDiv.innerHTML = `
                <h3>${option.time}</h3>
                <p>${option.cycles} complete cycles</p>
                <p class="quality-rating">Sleep Quality: <span class="quality-${option.quality.toLowerCase()}">${option.quality}</span></p>
                ${option.recommended ? '<p class="recommended-label">Recommended</p>' : ''}
            `;
            timeOptionsContainer.appendChild(optionDiv);
        });
    }
    
    // Initialize the calculator with default tab
    selectTab('wake-up');
});