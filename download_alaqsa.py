from streetlevel import streetview
import os

print("جاري سحب صورة المسجد الأقصى (360) البانورامية...")

# البانوراما ID المستخرج من الرابط لتل أبيب / الأقصى
pano_id = "CIHM0ogKEICAgICuloKUvQE"

# 1. جلب معلومات البانوراما من سيرفرات جوجل
pano = streetview.find_panorama_by_id(pano_id)

if pano:
    print(f"تم العثور على البانوراما! التاريخ: {pano.date}")
    # 2. تحميل ودمج الـ Tiles لتشكيل صورة بانورامية بدقة عالية (Zoom level 3 أو 4 لسرعة التحميل، 5 هي الأعلى)
    # زوم 3 يعطي صورة بدقة ~ 3328x1664 وهي ممتازة للواقع الافتراضي وأسرع في التحميل
    dest_path = "public/360/alaqsa.jpg"
    streetview.download_panorama(pano, dest_path, zoom=3)
    
    # نقل نسخة للعرض للمستخدم
    import shutil
    os.makedirs("الفديوهات", exist_ok=True)
    shutil.copy2(dest_path, "الفديوهات/alaqsa.jpg")
    print("✅ تمت العملية بنجاح! تم تحميل صورة المسجد الأقصى!")
else:
    print("❌ فشل في العثور على الأيدي (ID).")
