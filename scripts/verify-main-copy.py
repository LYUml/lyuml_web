"""Acceptance guard: compare rendered prose to the pre-redesign main build."""
import re
import subprocess
from html.parser import HTMLParser
from pathlib import Path

class Copy(HTMLParser):
    def __init__(self):
        super().__init__(); self.stack=[]; self.blocks=[]; self.text=[]
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        self.stack.append([tag, [], attrs])
        if tag=='br':
            for item in self.stack: item[1].append(' ')
        if tag in {'br','img','meta','link','input','hr','source','wbr'}: self.stack.pop()
    def handle_endtag(self, tag):
        index=next((i for i in range(len(self.stack)-1,-1,-1) if self.stack[i][0]==tag),None)
        if index is None:return
        for name,parts,attrs in self.stack[index:]:
            if name in {'p','h2','h3','h4','li'}:
                text=''.join(parts).strip()
                if text:self.blocks.append(text)
        del self.stack[index:]
    def handle_data(self, data):
        if any(x[0] in {'script','style'} for x in self.stack):return
        self.text.append(data)
        for item in self.stack:item[1].append(data)

def compact(text):return re.sub(r'\s+','',text)
root=Path(__file__).resolve().parents[1]
baseline=root/'.qa/main-baseline.html'
if not baseline.exists():raise SystemExit('Missing pre-redesign main build in .qa/main-baseline.html')
old,new=Copy(),Copy();old.feed(baseline.read_text());new.feed((root/'dist/index.html').read_text())
alltext=compact(''.join(new.text))
# Explicit homepage revisions requested by the author on 2026-10-30.
retired_home_copy={
    'You can call me Eric.',
    'Exploring intelligence in the built world.',
    'and how they help us understand and improve complex systems, especially in the built environment.',
}
unchanged=[text for text in old.blocks if text not in retired_home_copy]
missing=[text for text in unchanged if compact(text) not in alltext]
profile=subprocess.check_output(['git','show','main:src/data/profile.ts'],cwd=root)
assert profile==(root/'src/data/profile.ts').read_bytes(),'Profile data differs from main'
assert not missing,'Missing or changed prose: '+repr(missing)
print(f'PASS: {len(unchanged)} unchanged original prose blocks retained (3 approved homepage revisions); profile.ts byte-identical to main.')
