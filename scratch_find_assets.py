import urllib.request
import re
import os

# NASA/ESA Hubbell/ISS VR 360 direct download links (Public Domain)
esa_space_url = "https://www.esa.int/var/esa/storage/images/esa_multimedia/videos/2016/10/first_3d_360_video_from_space/16198944-1-eng-GB/First_3D_360_video_from_space.mp4"
# Wait, let's find valid ones programmatically or use safe ones.
print("We need to find direct links to real videos.")
