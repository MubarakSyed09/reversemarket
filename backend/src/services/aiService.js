export const extractRFQFromText = async (rawText) => {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Please provide valid requirement text.');
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert B2B procurement analyst. Extract structured specifications from this buyer prompt:
"${rawText}"

Respond ONLY with a valid JSON object matching this schema, with no markdown formatting:
{
  "title": "short descriptive title",
  "category": "one of: Stationery, Packaging, Apparel, Electronics, Manufacturing, Other",
  "quantity": number,
  "unit": "e.g. units, pieces, boxes, notebooks",
  "targetBudget": number,
  "deliveryCity": "city name",
  "deadlineDays": number,
  "description": "clean summary",
  "specs": { "key": "value" }
}`
            }]
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidate) {
          const cleaned = candidate.replace(/```json/g, '').replace(/```/g, '').trim();
          return JSON.parse(cleaned);
        }
      }
    } catch (err) {
      console.warn('Gemini API call skipped, using heuristic parser:', err.message);
    }
  }

  return heuristicParser(rawText);
};

function heuristicParser(text) {
  const lower = text.toLowerCase();

  // Match quantities with commas: e.g. 10,000 or 500
  const qtyMatch = text.match(/\b([\d,]+)\s*(pcs|pieces|units|notebooks|books|boxes|bags|shirts|t-shirts|hoodies|masks|chairs|rolls|trays|kg|containers)?\b/i);
  const quantity = qtyMatch ? parseInt(qtyMatch[1].replace(/,/g, ''), 10) : 1000;
  const unit = qtyMatch && qtyMatch[2] ? qtyMatch[2].toLowerCase() : 'units';

  // Match city (Check known major Indian industrial/commercial cities first)
  let deliveryCity = 'Hyderabad';
  if (/hyderabad|secunderabad/i.test(text)) deliveryCity = 'Hyderabad';
  else if (/mumbai|navi mumbai|thane/i.test(text)) deliveryCity = 'Mumbai';
  else if (/bengaluru|bangalore/i.test(text)) deliveryCity = 'Bengaluru';
  else if (/delhi|noida|gurugram|gurgaon|faridabad/i.test(text)) deliveryCity = 'Delhi NCR';
  else if (/chennai/i.test(text)) deliveryCity = 'Chennai';
  else if (/pune/i.test(text)) deliveryCity = 'Pune';
  else if (/kolkata|calcutta/i.test(text)) deliveryCity = 'Kolkata';
  else if (/ahmedabad|surat/i.test(text)) deliveryCity = 'Ahmedabad';
  else if (/jaipur/i.test(text)) deliveryCity = 'Jaipur';
  else if (/vijayawada|amaravati/i.test(text)) deliveryCity = 'Vijayawada';
  else if (/guntur/i.test(text)) deliveryCity = 'Guntur';
  else {
    const cityMatch = text.match(/(?:in|to|at|for|delivery\s+(?:to|in))\s+([A-Z][a-zA-Z]+)/i);
    if (cityMatch && cityMatch[1]) deliveryCity = cityMatch[1].trim();
  }

  // Match deadline days
  const daysMatch = text.match(/within\s+(\d+)\s*days?/i) || text.match(/in\s+(\d+)\s*days?/i) || text.match(/(\d+)\s*days?\s*delivery/i);
  const deadlineDays = daysMatch ? parseInt(daysMatch[1], 10) : 10;

  // Match budget with ₹, Rs, INR, or budget keyword
  const budgetMatch = text.match(/(?:₹|rs\.?|inr|\$)\s*([\d,]+)/i) || 
                      text.match(/budget\s*(?:of|is|:)?\s*(?:₹|rs\.?|inr|\$)?\s*([\d,]+)/i) ||
                      text.match(/target\s*(?:of|is|:)?\s*(?:₹|rs\.?|inr|\$)?\s*([\d,]+)/i);
  let targetBudget = budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, ''), 10) : 0;
  if (!targetBudget || targetBudget < 100) {
    // Sensible B2B default budget based on quantity
    targetBudget = quantity * 75;
  }

  // Category detection
  let category = 'Industrial';
  if (/notebook|planner|paper|pen|stationery|print|diary|books/i.test(text)) category = 'Stationery';
  else if (/box|packaging|carton|wrap|container|tray|bag/i.test(text)) category = 'Packaging';
  else if (/shirt|hoodie|apparel|fabric|uniform|cloth|wear/i.test(text)) category = 'Apparel';
  else if (/chair|furniture|desk|rack|pallet/i.test(text)) category = 'Industrial';
  else if (/mask|medical|gloves|sanitizer|pharma|ppe/i.test(text)) category = 'Medical';
  else if (/cable|sensor|board|electronic|pcb|led/i.test(text)) category = 'Electronics';

  const specs = {};
  if (/gsm/i.test(text)) {
    const gsmMatch = text.match(/(\d+)\s*gsm/i);
    specs['Material Weight'] = gsmMatch ? `${gsmMatch[1]} GSM` : '80 GSM';
  }
  if (/ply/i.test(text)) {
    const plyMatch = text.match(/(\d+)\s*[- ]?ply/i);
    specs['Ply Construction'] = plyMatch ? `${plyMatch[1]}-Ply` : '3-Ply';
  }

  // Format clean human title
  let itemName = 'Procurement Requirement';
  if (/hoodie/i.test(text)) itemName = 'Custom Fleece Hoodies';
  else if (/notebook|planner/i.test(text)) itemName = 'Custom Executive Planners';
  else if (/box|carton/i.test(text)) itemName = 'Corrugated Shipping Boxes';
  else if (/mask/i.test(text)) itemName = 'Medical N95 Protective Masks';
  else if (/chair/i.test(text)) itemName = 'Ergonomic Task Chairs';
  else if (/roll|thermal/i.test(text)) itemName = 'Thermal Billing Paper Rolls';
  else if (/tray/i.test(text)) itemName = 'Compostable Meal Trays';
  else {
    const cleanedSnippet = text.replace(/^(i\s+need|need|looking\s+for|require)\s+/i, '').split(/within|in\s+\d+|budget/i)[0].trim();
    if (cleanedSnippet.length > 5 && cleanedSnippet.length < 50) itemName = cleanedSnippet;
  }

  const title = `${quantity.toLocaleString('en-IN')} ${itemName} - ${deliveryCity}`;

  return {
    title,
    category,
    quantity,
    unit,
    targetBudget,
    deliveryCity,
    deadlineDays,
    description: text,
    specs: Object.keys(specs).length > 0 ? specs : { "Standard": "Certified Enterprise Production Quality" }
  };
}
