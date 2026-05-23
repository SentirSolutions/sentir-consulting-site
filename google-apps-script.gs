/**
 * Sentir Consulting — Google Apps Script Lead Capture
 *
 * SETUP INSTRUCTIONS:
 * 1. Open Google Sheets and create a new spreadsheet named "Sentir Leads"
 * 2. In the spreadsheet, go to Extensions → Apps Script
 * 3. Delete any existing code and paste this entire file
 * 4. Click Save (Ctrl+S)
 * 5. Click Deploy → New Deployment
 * 6. Type: Web App
 * 7. Execute as: Me
 * 8. Who has access: Anyone
 * 9. Click Deploy and authorize when prompted
 * 10. Copy the Web App URL
 * 11. In opportunity.html, replace 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE' with that URL
 * 12. Redeploy the website
 *
 * Each lead submission will add one row to the spreadsheet.
 * You'll see: timestamp, name, company, email, their business numbers,
 * and the opportunity estimates the calculator showed them.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Add header row if the sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Name',
        'Company',
        'Email',
        'Revenue',
        'Employees',
        'EBITDA',
        'Owner Dependency',
        'Waste Min',
        'Waste Max',
        'Valuation Gap',
        'Admin Hours/Wk',
        'Total Opportunity'
      ]);
      // Bold the header row
      sheet.getRange(1, 1, 1, 13).setFontWeight('bold');
    }

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.name        || '',
      data.company     || '',
      data.email       || '',
      data.revenue     || '',
      data.employees   || '',
      data.ebitda      || '',
      data.dependency  || '',
      data.wasteMin    || '',
      data.wasteMax    || '',
      data.valuationGap || '',
      data.adminHours  || '',
      data.totalOpp    || ''
    ]);

    // Optional: send yourself an email notification for each lead
    // Uncomment the lines below and replace with your email address
    //
    // MailApp.sendEmail({
    //   to: 'timothy.hislop@sentir-solutions.com',
    //   subject: 'New Sentir Lead: ' + (data.company || data.name || data.email),
    //   body: 'A new lead submitted the opportunity calculator.\n\n' +
    //         'Name: ' + data.name + '\n' +
    //         'Company: ' + data.company + '\n' +
    //         'Email: ' + data.email + '\n' +
    //         'Revenue: $' + Number(data.revenue).toLocaleString() + '\n' +
    //         'Employees: ' + data.employees + '\n' +
    //         'Owner Dependency: ' + data.dependency + '\n\n' +
    //         'Estimated Opportunity: $' + Number(data.totalOpp).toLocaleString() + '\n\n' +
    //         'View all leads: [your Google Sheet URL]'
    // });

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Health check — visiting the URL directly shows this message
function doGet(e) {
  return ContentService.createTextOutput('Sentir lead capture endpoint is active.');
}
