from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Course(models.Model):

    MATH = 'M'
    SCIENCE = 'S'
    ENGLISH = 'E'
    HISTORY = 'H'
    ELECTIVE = 'E'
    COURSE_SUBJECT_CHOICES = (
        (MATH, 'Math'),
        (SCIENCE, 'Science'),
        (ENGLISH, 'English'),
        (HISTORY, 'History'),
        (ELECTIVE, 'Elective'),
    )

    course_code = models.CharField(max_length=30, unique=True)
    course_name = models.CharField(max_length=30)
    course_subject = models.CharField(max_length=3,
        choices=COURSE_SUBJECT_CHOICES, default=ELECTIVE)
    student = models.ManyToManyField(User)


    def as_dict(self):
        return {
            'courseCode' : self.course_code,
            'courseName': self.course_name,
            'courseSubject': self.course_subject,
        }