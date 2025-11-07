// Product conversion data
const conversionData = {
    milk: {
        name: "Milk",
        unit: "Liters",
        conversions: {
            cheese: {
                name: "Cheese",
                rate: 0.1,
                unit: "kg",
                revenueIncrease: "300-400%",
                processingTime: "2-4 hours + aging (weeks to months)",
                equipment: "Thermometer, cheese molds, cultures, rennet"
            },
            yogurt: {
                name: "Yogurt",
                rate: 1.0,
                unit: "L",
                revenueIncrease: "200-250%",
                processingTime: "4-8 hours",
                equipment: "Yogurt maker or insulated container, cultures"
            },
            butter: {
                name: "Butter",
                rate: 0.05,
                unit: "kg",
                revenueIncrease: "250-300%",
                processingTime: "30-60 minutes",
                equipment: "Butter churn or mixer, separator"
            },
            ghee: {
                name: "Ghee (Clarified Butter)",
                rate: 0.04,
                unit: "kg",
                revenueIncrease: "400-500%",
                processingTime: "45-90 minutes",
                equipment: "Heavy-bottomed pan, strainer, storage jars"
            }
        }
    },
    fruits: {
        name: "Fruits",
        unit: "Kilograms",
        conversions: {
            jam: {
                name: "Jam/Preserve",
                rate: 1.2,
                unit: "kg",
                revenueIncrease: "200-300%",
                processingTime: "1-2 hours",
                equipment: "Large pot, jars, pectin, sugar"
            },
            juice: {
                name: "Fruit Juice",
                rate: 0.7,
                unit: "L",
                revenueIncrease: "150-200%",
                processingTime: "30-60 minutes",
                equipment: "Juicer, bottles, pasteurizer"
            },
            dried: {
                name: "Dried Fruits",
                rate: 0.2,
                unit: "kg",
                revenueIncrease: "300-400%",
                processingTime: "6-12 hours",
                equipment: "Food dehydrator or solar dryer"
            },
            puree: {
                name: "Fruit Puree",
                rate: 0.9,
                unit: "kg",
                revenueIncrease: "180-250%",
                processingTime: "1-2 hours",
                equipment: "Blender, strainer, sterilization equipment"
            }
        }
    },
    vegetables: {
        name: "Vegetables",
        unit: "Kilograms",
        conversions: {
            sauce: {
                name: "Sauce/Paste",
                rate: 0.33,
                unit: "L",
                revenueIncrease: "250-350%",
                processingTime: "2-4 hours",
                equipment: "Large pot, blender, jars, spices"
            },
            pickle: {
                name: "Pickles",
                rate: 0.8,
                unit: "kg",
                revenueIncrease: "200-300%",
                processingTime: "30 min + fermentation (days)",
                equipment: "Jars, brine, spices, sterilization equipment"
            },
            dried: {
                name: "Dried Vegetables",
                rate: 0.15,
                unit: "kg",
                revenueIncrease: "350-450%",
                processingTime: "6-10 hours",
                equipment: "Food dehydrator or solar dryer"
            },
            frozen: {
                name: "Frozen Vegetables",
                rate: 0.9,
                unit: "kg",
                revenueIncrease: "150-200%",
                processingTime: "1-2 hours (blanching + freezing)",
                equipment: "Freezer, blanching equipment, packaging"
            }
        }
    },
    grains: {
        name: "Grains",
        unit: "Kilograms",
        conversions: {
            flour: {
                name: "Flour",
                rate: 0.75,
                unit: "kg",
                revenueIncrease: "150-200%",
                processingTime: "30-60 minutes",
                equipment: "Grain mill or grinder, sifter"
            },
            bread: {
                name: "Bread",
                rate: 1.3,
                unit: "kg",
                revenueIncrease: "300-400%",
                processingTime: "3-5 hours",
                equipment: "Oven, mixer, baking pans"
            },
            pasta: {
                name: "Pasta",
                rate: 1.1,
                unit: "kg",
                revenueIncrease: "250-350%",
                processingTime: "2-3 hours",
                equipment: "Pasta maker, drying racks"
            },
            cereal: {
                name: "Breakfast Cereal",
                rate: 0.95,
                unit: "kg",
                revenueIncrease: "350-450%",
                processingTime: "2-4 hours",
                equipment: "Roaster, mixer, packaging equipment"
            }
        }
    },
    honey: {
        name: "Honey",
        unit: "Kilograms",
        conversions: {
            creamed: {
                name: "Creamed Honey",
                rate: 1.0,
                unit: "kg",
                revenueIncrease: "150-200%",
                processingTime: "7-14 days",
                equipment: "Mixer, temperature-controlled room, jars"
            },
            honeycomb: {
                name: "Comb Honey",
                rate: 0.8,
                unit: "kg",
                revenueIncrease: "200-250%",
                processingTime: "Minimal (packaging only)",
                equipment: "Packaging materials, labels"
            },
            mead: {
                name: "Mead (Honey Wine)",
                rate: 3.0,
                unit: "L",
                revenueIncrease: "400-600%",
                processingTime: "1-3 months",
                equipment: "Fermentation vessels, yeast, bottles"
            }
        }
    },
    herbs: {
        name: "Fresh Herbs",
        unit: "Kilograms",
        conversions: {
            dried: {
                name: "Dried Herbs",
                rate: 0.25,
                unit: "kg",
                revenueIncrease: "400-500%",
                processingTime: "3-7 days",
                equipment: "Drying rack or dehydrator, packaging"
            },
            oil: {
                name: "Herb-Infused Oil",
                rate: 0.8,
                unit: "L",
                revenueIncrease: "300-400%",
                processingTime: "2-4 weeks",
                equipment: "Bottles, carrier oil, strainer"
            },
            tea: {
                name: "Herbal Tea",
                rate: 0.2,
                unit: "kg",
                revenueIncrease: "500-600%",
                processingTime: "3-7 days drying",
                equipment: "Dehydrator, tea bags or packaging"
            },
            pesto: {
                name: "Pesto/Herb Paste",
                rate: 1.5,
                unit: "kg",
                revenueIncrease: "250-350%",
                processingTime: "1-2 hours",
                equipment: "Food processor, jars, oil"
            }
        }
    }
};

// Update conversion options based on selected raw product
function updateConversionOptions() {
    const rawProduct = document.getElementById('raw-product').value;
    const conversionSelect = document.getElementById('value-added-product');
    const conversionOptions = document.getElementById('conversion-options');
    const quantityInput = document.getElementById('quantity-input');
    const results = document.getElementById('results');
    
    // Reset
    conversionSelect.innerHTML = '<option value="">-- Select conversion --</option>';
    quantityInput.style.display = 'none';
    results.style.display = 'none';
    
    if (rawProduct && conversionData[rawProduct]) {
        const product = conversionData[rawProduct];
        const conversions = product.conversions;
        
        // Populate conversion options
        for (const key in conversions) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = conversions[key].name;
            conversionSelect.appendChild(option);
        }
        
        conversionOptions.style.display = 'block';
    } else {
        conversionOptions.style.display = 'none';
    }
}

// Update calculation based on selections
function updateCalculation() {
    const rawProduct = document.getElementById('raw-product').value;
    const valueAddedProduct = document.getElementById('value-added-product').value;
    const quantity = parseFloat(document.getElementById('quantity').value);
    const quantityInput = document.getElementById('quantity-input');
    const results = document.getElementById('results');
    const unitLabel = document.getElementById('unit-label');
    
    if (!rawProduct || !valueAddedProduct) {
        quantityInput.style.display = 'none';
        results.style.display = 'none';
        return;
    }
    
    const product = conversionData[rawProduct];
    const conversion = product.conversions[valueAddedProduct];
    
    // Show quantity input with proper unit
    unitLabel.textContent = product.unit;
    quantityInput.style.display = 'block';
    
    if (!quantity || quantity <= 0) {
        results.style.display = 'none';
        return;
    }
    
    // Calculate results
    const outputAmount = quantity * conversion.rate;
    
    // Update result display
    document.getElementById('raw-amount').textContent = 
        `${quantity} ${product.unit} of ${product.name}`;
    document.getElementById('value-added-amount').textContent = 
        `${outputAmount.toFixed(2)} ${conversion.unit} of ${conversion.name}`;
    document.getElementById('revenue-increase').textContent = 
        conversion.revenueIncrease;
    document.getElementById('processing-time').textContent = 
        conversion.processingTime;
    document.getElementById('equipment').textContent = 
        conversion.equipment;
    
    results.style.display = 'block';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Farmer Value-Added Products Support System loaded successfully');
});
