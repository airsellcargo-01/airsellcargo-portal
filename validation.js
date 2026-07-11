document.getElementById('awbForm').addEventListener('submit', function(event) {
    // 1. STOP THE PAGE FROM AUTOMATIC RELOAD
    event.preventDefault();

    // 2. IATA MODULO 7 VALIDATION FOR THE AWB NUMBER
    const awbInput = document.getElementById('awb_number').value.replace(/[^0-9]/g, ''); // Strip hyphens/spaces
    
    if (awbInput.length !== 11 && awbInput.length !== 8) {
        alert('Error: Air Waybill number must be an 8-digit serial number (or 11 digits with prefix).');
        return;
    }

    // Extract the 7-digit serial component to run standard Modulo 7 tracking validation
    // If user provided 11 digits, extract digits 3 to 10. If 8 digits, extract digits 0 to 7.
    const serialStr = awbInput.length === 11 ? awbInput.substring(3, 10) : awbInput.substring(0, 7);
    const checkDigitStr = awbInput.length === 11 ? awbInput.substring(10, 11) : awbInput.substring(7, 8);
    
    const coreNumber = parseInt(serialStr, 10);
    const checkDigit = parseInt(checkDigitStr, 10);
    
    if (coreNumber % 7 !== checkDigit) {
        alert('Error: Invalid AWB Number. Modulo 7 verification failed.');
        return;
    }

    // 3. IATA AIRPORT CODE VALIDATION
    const origin = document.getElementById('origin').value.toUpperCase().trim();
    const destination = document.getElementById('destination').value.toUpperCase().trim();
    const iataRegex = /^[A-Z]{3}$/;

    if (!iataRegex.test(origin) || !iataRegex.test(destination)) {
        alert('Error: Departure and Destination fields must be valid 3-letter IATA airport codes (e.g., JFK, LHR).');
        return;
    }

    // 4. COLLECT COMPLETE MANIFEST DATA DATASET
    const newShipment = {
        airlinePrefix: document.getElementById('airline_prefix').value.trim(),
        awbNumber: document.getElementById('awb_number').value.trim(),
        shipper: document.getElementById('shipper_details').value.trim(),
        consignee: document.getElementById('consignee_details').value.trim(),
        origin: origin,
        toAirport: document.getElementById('to_airport').value.toUpperCase().trim(),
        destination: destination,
        carrier: document.getElementById('carrier').value.trim(),
        currency: document.getElementById('currency').value.trim(),
        chgsCode: document.getElementById('chgs_code').value.trim(),
        pieces: document.getElementById('pieces').value,
        weight: document.getElementById('weight').value,
        rateClass: document.getElementById('rate_class').value,
        chargeableWeight: document.getElementById('chargeable_weight').value,
        rateCharge: document.getElementById('rate_charge').value,
        totalCharge: document.getElementById('total_charge').value,
        goodsDesc: document.getElementById('goods_desc').value.trim(),
        totalPrepaid: document.getElementById('total_prepaid').value,
        totalCollect: document.getElementById('total_collect').value,
        timestamp: new Date().toLocaleString('en-US', { hour12: true }),
        status: 'Pending Departure' // Enforces workflow state control
    };

    // 5. COMMMIT OBJECT TO LOCALSTORAGE ARRAY
    let savedShipments = JSON.parse(localStorage.getItem('airCargoShipments')) || [];
    
    // Inject newest waybill log straight to top of stack position
    savedShipments.unshift(newShipment);
    
    // Overwrite baseline records store
    localStorage.setItem('airCargoShipments', JSON.stringify(savedShipments));

    // 6. REDIRECT USER TO MAIN DASHBOARD LOG PANEL
    alert('AWB Saved Successfully into Local Manifest Storage!');
    window.location.href = 'index.html';
});
