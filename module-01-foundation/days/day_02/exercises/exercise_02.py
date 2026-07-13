student_score = 78
if student_score >= 90:
    print("Grade: A")
elif student_score >= 80:
    print("Grade: B")
elif student_score >= 70:
    print("Grade: C")
elif student_score >= 60:
    print("Grade: D")
else:
    print("Grade: F")

print("Student Score:", student_score)
if student_score >= 90: 
    print("You're in the A range!")
elif student_score >= 80 and student_score < 90:
    print("You're in the B range!")
elif student_score >= 70 and student_score < 80:
    print("You're in the C range!")
elif student_score >= 60 and student_score < 70:
    print("You're in the D range!")
else:
    print("You're in the F range!")
