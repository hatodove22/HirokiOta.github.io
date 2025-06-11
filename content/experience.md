---
title: 'Experience'
date: 2023-10-24
type: landing

design:
  spacing: '5rem'

# Note: `username` refers to the user's folder name in `content/authors/`

# Page sections
sections:
  - block: resume-experience
    content:
      username: admin
    design:
      # Hugo date format
      date_format: 'January 2006'
      # Education or Experience section first?
      is_education_first: false
  - block: resume-skills
    content:
      title: Skills & Hobbies
      username: admin
    design:
      show_skill_percentage: false
  - block: resume-awards # This is the original awards block
    content:
      title: Awards
      username: admin
  # New sections start here
  - block: markdown
    content:
      title: "" # Title can be empty if using Markdown headings
      text: |-
        ## Extracurricular Activities
        - 缶サット甲子園, 全国大会準優勝(通算2回受賞)
        - Google Science Jam 2015, JAXA 審査員賞 (2015)
        - IVRC 2022, SEED STAGE選出 (2022)
        - 経済産業省 令和4年度未踏的な地方の若手人材発掘育成支援事業補助金AKATSUKIプロジェクト採択事業
        - 関西テック・クリエイティブ人材共創事業,採択
    design:
      columns: '1' # Ensure full width
  - block: markdown
    content:
      title: ""
      text: |-
        ## Funding Received
        - 関西テッククリエイターチャレンジ: 165万円
        - JASSO 海外留学支援制度（協定派遣）: 66万円
        - NAIST 長期留学支援制度: 70万円
        - JST 次世代研究者挑戦的研究プログラム(NAIST Granite Program): 総額約800万円
    design:
      columns: '1'
  - block: markdown
    content:
      title: ""
      text: |-
        ## Academic Contributions
        - 触覚若手の会 第19回集会疑似査読者会議
        - 触覚若手の会 触覚デモ交流会（ベストプレゼンテーション賞）
        - 触覚講習会2024 (デモ展示) (2024)
        - IEEE International Conference on Robotics and Automation (ICRA), 2024, Student Volunteer (2024)
        - IEEE Conference Virtual Reality and 3D User Interfaces (IEEE VR), 2025, Student Volunteer (2025)
        - International Conference on Augmented Humans (AHs), 査読協力
        - IEEE World Haptics Conference (WHC), 2025, 査読協力 (2025)
    design:
      columns: '1'
  # New sections end here
  - block: resume-languages
    content:
      title: Languages
      username: admin
---
