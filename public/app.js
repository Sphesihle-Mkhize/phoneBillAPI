document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('phonebill-form');
    const resultDiv = document.getElementById('result');
    const clearButton = document.getElementById('clear-button');
    const pricePlanSelect = document.getElementById('price-plan');

    // Populate price plans (fetch from backend)
    fetch('/api/price_plans/')
        .then(response => response.json())
        .then(plans => {
            plans.forEach(plan => {
                const option = document.createElement('option');
                option.value = plan.plan_name;
                option.textContent = plan.plan_name;
                pricePlanSelect.appendChild(option);
            });
        });

    // Handle form submission
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = {
            price_plan: formData.get('price-plan'),
            actions: formData.get('actions')
        };

        try {
            const response = await fetch('/api/phonebill/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            if (result.error) {
                resultDiv.textContent = `Error: ${result.error}`;
            } else {
                // Check if total is a number before calling toFixed
                if (typeof result.total === 'number') {
                    resultDiv.textContent = `Total Bill: ${result.total.toFixed(2)} ZAR`;
                } else {
                    resultDiv.textContent = 'Error: Invalid response format';
                }
            }
        } catch (error) {
            resultDiv.textContent = `Error: ${error.message}`;
        }
    });

    // Handle clear button click
    clearButton.addEventListener('click', () => {
        form.reset();
        resultDiv.textContent = '';
    });
});
