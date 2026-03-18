export const orderConfirmedEmailTemplate = (data) => {
    const { omsOrderId, estimateAmount, expectedDeliveryDate, products } = data
    const totalAmount = products.reduce((sum, product) => {
        return sum + (product.price * product.qty)
    }, 0)

    const totalItems = products.reduce((sum, product) => {
        return sum + (product.qty)
    }, 0)
    return `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
            <link href='https://fonts.googleapis.com/css?family=Righteous' rel='stylesheet'>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmation Notification</title>
            <style>
                /* Add CSS styles for formatting */
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f2f2f2;
                    padding: 20px;
                }
        
                .container {
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 10px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .tagline {
                    font-family: Righteous;
                }
        
                .header {
                    margin-bottom: 30px;
                }
        
                .message {
                    margin-bottom: 20px;
                }
        
                .footer {
                    margin-top: 30px;
                }
            </style>
        </head>
        <body>
        <div class="container">
          <div class="message">
            <h3>New Order Placed - ${omsOrderId}</h3>
            <p>A new order has been placed in the system.</p>
            
           
            <p><strong>OMS Order ID:</strong> ${omsOrderId}</p>
            <p><strong>Estimate Amount:</strong> ₹${estimateAmount}</p>
            <p><strong>Expected Delivery Date:</strong> ${expectedDeliveryDate}</p>
            

            <hr>
            <h4>Products:</h4>
            <ul>
              ${products.map((product, index) => `
                <li>${index + 1}. ${product.name} - ₹${product.price} × ${product.qty}</li>
              `).join('')}
            </ul>
            <hr>

            <p><strong>Total Items:</strong>${totalItems}</p>
            <p><strong>Total Amount:</strong>₹${totalAmount}</p>
          </div>
        </div>
      </body>

    </html>
    `;
};