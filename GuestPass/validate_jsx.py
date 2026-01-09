
import re

file_path = r'e:\Ujjandotcom\Altertec\GRANDCITY FINAL\GuestPass\index.html'

def validate_jsx(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract script content
    script_pattern = re.compile(r'<script type="text/babel">([\s\S]*?)</script>')
    match = script_pattern.search(content)
    
    if not match:
        print("No babel script found")
        return
        
    script_content = match.group(1)
    # Calculate offset
    start_pos = match.start(1)
    
    # We want to map script_content position back to line numbers in file
    # Or just use script_content lines.
    
    # We will tokenize the script content finding tags
    tag_regex = re.compile(r'<(/?)(\w+)([\s\S]*?)(/?)>')
    
    stack = []
    
    # Find all tags
    for m in tag_regex.finditer(script_content):
        result = m.group(0)
        is_closing = m.group(1) == '/'
        tag_name = m.group(2)
        attrs = m.group(3)
        is_self_closing = m.group(4) == '/' or attrs.strip().endswith('/')
        
        # Determine line number of this tag
        # Count newlines in content up to m.start()
        # Offset + match start
        absolute_pos = start_pos + m.start()
        line_num = content[:absolute_pos].count('\n') + 1
        
        if tag_name in ['br', 'img', 'input', 'hr', 'meta', 'link']:
            continue
            
        if is_self_closing:
            continue
            
        if not is_closing:
            stack.append((tag_name, line_num))
        else:
            if not stack:
                print(f"Error at line {line_num}: Unexpected closing tag </{tag_name}> (Stack empty)")
                # Continue? No, broken.
                return
            
            last_tag, last_line = stack.pop()
            if last_tag != tag_name:
                print(f"Error at line {line_num}: Expected closing tag for <{last_tag}> (opened at {last_line}), but found </{tag_name}>")
                print(f"Snippet around error:")
                lines = content.split('\n')
                for i in range(max(0, line_num-5), min(len(lines), line_num+2)):
                    print(f"{i+1}: {lines[i]}")
                return
                
    if stack:
        print(f"Error: Unclosed tags remaining: {stack}")
        # Print snippet for last unclosed
        last_tag, last_line = stack[-1]
        lines = content.split('\n')
        print(f"Snippet around unclosed <{last_tag}>:")
        for i in range(max(0, last_line-2), min(len(lines), last_line+5)):
            print(f"{i+1}: {lines[i]}")

validate_jsx(file_path)
