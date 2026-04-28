import os
import shutil
import subprocess

def clear_directory(path):
    if not os.path.exists(path):
        os.makedirs(path, exist_ok=True)
    for filename in os.listdir(path):
        file_path = os.path.join(path, filename)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
        except Exception as e:
            print(f'Failed to delete {file_path}. Reason: {e}')

print("🧹 جاري تفريغ مكتبة الفيديوهات لتصبح حصرية لروابطك المتخصصة...")
clear_directory('public/videos')
clear_directory('الفديوهات')

youtube_links = [
    "https://youtu.be/Sv7Zz3N_oPM?si=uWKRUmrYoMO_wEYa",
    "https://youtu.be/DrWOXSlEN94?si=j7u42VQad8ArFvXt",
    "https://youtu.be/mSPpsmQgTgs?si=hngdiU3tbXweXp8d",
    "https://youtu.be/AznG2O5t8MU?si=zTq2gpSspl446Gbw",
    "https://youtu.be/cwC3vUpLy0s?si=RUN3ZumtVjw7KfTZ",
    "https://youtu.be/eKumVFvGHFA?si=ipcbUbJ_i5cccE04",
    "https://youtu.be/LJyclVpwAio?si=E3CR-DhoXwyMnZ16",
    "https://youtu.be/GgXtU-rpzYM?si=6yJ--JKOn9pLVdBC"
]

print("\n🚀 جاري البدء في السحب باستخدام yt-dlp بدقة معتدلة (أقصاها 1080p)...")

for idx, url in enumerate(youtube_links, start=1):
    dest = f"public/videos/vr_video_{idx}.mp4"
    print(f"[{idx}/{len(youtube_links)}] - جاري سحب {url} ...")
    
    # Selecting the best video format capping at 1080p to save space and ensure local smoothness + audio
    cmd = [
        'yt-dlp', 
        '-f', 'bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080][ext=mp4]/best', 
        '-o', dest, 
        '--no-warnings', 
        url
    ]
    subprocess.run(cmd)

print("\n🚀 جاري إنشاء نُسخ في مجلد الفديوهات ليتمكن المستخدم من الوصول السريع...")
for file in os.listdir('public/videos'):
    if file.endswith('.mp4'):
        shutil.copy2(f'public/videos/{file}', f'الفديوهات/{file}')

print("✅ تم تفريغ الحمولات بنجاح!")
