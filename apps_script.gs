/**
 * الصق الكود ده في Google Apps Script (خطوات الإعداد في رسالة Claude).
 * وظيفته: يستقبل بيانات كل عملية دخول ناجحة ويضيفها كسطر جديد في Google Sheets،
 * وبيرفض أي طلب معاهوش المفتاح السري الصحيح.
 */

// لازم تكون نفس القيمة بالظبط المكتوبة في LOG_SECRET_KEY جوه calculator.html
var SECRET_KEY = 'Sm4rtC4lc_2026_XyZ99';

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  try {
    var data = JSON.parse(e.postData.contents);

    // رفض أي طلب مايحملش المفتاح السري الصحيح
    if (data.secret !== SECRET_KEY) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'rejected' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // أول مرة تشغّل السكريبت، لو الشيت فاضي، بنضيف صف العناوين
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['الوقت', 'الاسم', 'نوع الدخول', 'كود الجهاز', 'نظام التشغيل', 'المتصفح']);
    }

    sheet.appendRow([
      data.time || new Date().toISOString(),
      data.name || '',
      data.entryType || '',
      data.deviceId || '',
      data.os || '',
      data.browser || ''
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
