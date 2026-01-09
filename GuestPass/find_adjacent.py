
import re

file_path = r'e:\Ujjandotcom\Altertec\GRANDCITY FINAL\GuestPass\index.html'

def find_adjacent(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Compress whitespace
    compressed = re.sub(r'\s+', ' ', content)
    
    # Look for div close followed by select close
    pattern = r'</div>\s*</select>'
    
    match = re.search(pattern, content) # Use original content to get lines
    
    if match:
        print(f"Found match at offset {match.start()}")
        # Find line number
        line_num = content[:match.start()].count('\n') + 1
        print(f"Line number: {line_num}")
        print("Context:")
        lines = content.split('\n')
        for i in range(max(0, line_num-3), min(len(lines), line_num+3)):
            print(f"{i+1}: {lines[i]}")
    else:
        print("No match found for </div> followed by </select>")

find_adjacent(file_path)
