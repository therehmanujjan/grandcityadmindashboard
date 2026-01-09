
import re

file_path = r'e:\Ujjandotcom\Altertec\GRANDCITY FINAL\GuestPass\index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(len(lines) - 2):
    l1 = lines[i].strip()
    l2 = lines[i+1].strip()
    l3 = lines[i+2].strip()
    
    if l1.endswith('</button>') and l2.endswith('</div>') and l3.endswith('</select>'):
        print(f"Found match at line {i+1}:")
        print(f"{i+1}: {lines[i].rstrip()}")
        print(f"{i+2}: {lines[i+1].rstrip()}")
        print(f"{i+3}: {lines[i+2].rstrip()}")
