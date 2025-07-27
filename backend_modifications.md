# Backend Modifications for Enhanced Food Waste Management

## 1. Update Email Service (emailService.js)

Replace the message in your `/add-data` endpoint with:

```javascript
const message = `Hey ${user.userName},

🍱 New food donation available!

Item: ${foodItem}
Location: ${location}
Serves: ${expectedPeople} people
Contact: ${contact}

👆 GRAB THIS FOOD NOW! 👆
Click the link below to view and accept this donation:
http://localhost:3000/?foodId=${result.insertedId}

Hurry up and grab it before someone else does!

Best regards,
FoodShare Team`;
```

## 2. Add New Endpoint for Confirming Receipt

Add this new endpoint in your `index.js`:

```javascript
// Confirm food received
app.post("/confirm-received", async (req, res) => {
  try {
    const { foodId } = req.body;

    if (!foodId) {
      return res.status(400).json({ error: "Food ID is required" });
    }

    const result = await foodCollection.updateOne(
      { _id: new ObjectId(foodId) },
      { $set: { received: true, receivedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Food item not found" });
    }

    res.status(200).json({ message: "Food marked as received and removed from available list." });
  } catch (error) {
    console.error("Error confirming food receipt:", error);
    res.status(500).json({ error: "Failed to confirm receipt" });
  }
});
```

## 3. Update Available Foods Query

Modify your `/available-foods` endpoint to exclude received items:

```javascript
// Get all available foods
app.get("/available-foods", async (req, res) => {
  try {
    const foods = await foodCollection.find({ 
      received: { $ne: true }  // Exclude received items
    }).toArray();
    
    const formattedFoods = foods.map(food => ({
      ...food,
      _id: food._id.toString()
    }));
    res.json(formattedFoods);
  } catch (error) {
    console.error("Error fetching available foods:", error);
    res.status(500).json({ error: "Failed to fetch food data" });
  }
});
```

## 4. Optional: Add Homepage Route for Direct Links

Add this route to handle direct food links from emails:

```javascript
// Handle direct food links from emails
app.get("/", (req, res) => {
  const { foodId } = req.query;
  if (foodId) {
    // Redirect to frontend with food ID highlighted
    res.redirect(`http://localhost:3000/?highlight=${foodId}`);
  } else {
    res.sendFile(path.join(__dirname, "homepage.html"));
  }
});
```

## How It Works:

1. **Email with Grab Button**: When food is added, users receive an email with a direct link to view that specific food item
2. **Waiting Status**: When a user accepts food, it shows "waiting for pickup" 
3. **Received Confirmation**: The user who accepted can mark it as "received" to remove it completely
4. **Clean Database**: Only truly available food shows up in the list

Start your backend with these changes and the React frontend will work perfectly with your existing MongoDB setup!