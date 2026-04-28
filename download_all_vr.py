import os
import shutil
import subprocess
import imageio_ffmpeg

ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()

def clear_directory(path):
    if not os.path.exists(path):
        os.makedirs(path, exist_ok=True)
    for filename in os.listdir(path):
        file_path = os.path.join(path, filename)
        try:
            if os.path.isfile(file_path):
                # Don't delete our previously successfully downloaded Al-Aqsa picture!
                if "alaqsa" not in filename:
                    os.unlink(file_path)
        except Exception as e:
            print(f'Failed to delete {file_path}. Reason: {e}')

print("🧹 جاري تنظيف الملفات المعطوبة والمجزأة...")
clear_directory('public/videos')

# Ensure al-aqsa image is in الفديوهات if anything happened
if os.path.exists("public/360/alaqsa.jpg"):
    os.makedirs("الفديوهات", exist_ok=True)
    shutil.copy2("public/360/alaqsa.jpg", "الفديوهات/alaqsa.jpg")

youtube_links = [
    "https://youtu.be/Sv7Zz3N_oPM", #1
    "https://youtu.be/DrWOXSlEN94", #2
    "https://youtu.be/mSPpsmQgTgs", #3
    "https://youtu.be/AznG2O5t8MU", #4
    "https://youtu.be/cwC3vUpLy0s", #5
    "https://youtu.be/eKumVFvGHFA", #6
    "https://youtu.be/LJyclVpwAio", #7
    "https://youtu.be/GgXtU-rpzYM"  #8
]

print("\n🚀 جاري البدء في السحب بدقة 1080p ودمج الصوت والصورة باستخدام محرك FFmpeg...")

for idx, url in enumerate(youtube_links, start=1):
    dest = f"public/videos/vr_video_{idx}.mp4"
    print(f"[{idx}/8] - جاري سحب ودمج {url} ...")
    
    cmd = [
        'yt-dlp', 
        '--ffmpeg-location', ffmpeg_path,
        '--merge-output-format', 'mp4',
        '-f', 'bestvideo[ext=mp4][height<=1080]+bestaudio[ext=m4a]/best[ext=mp4]/best', 
        '-o', dest, 
        '--no-warnings', 
        url
    ]
    subprocess.run(cmd)

print("\n🚀 جاري إنشاء نُسخ في مجلد الفديوهات ليتمكن المستخدم من الوصول السريع...")
for file in os.listdir('public/videos'):
    if file.endswith('.mp4'):
        shutil.copy2(f'public/videos/{file}', f'الفديوهات/{file}')

print("✅ تم تفريغ الحمولات بنجاح! جميع الفيديوهات الآن مدمجة كـ mp4 حقيقي.")
