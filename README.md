# CourseSelection
To Pick Courses


Python Version 3.6.1



# Setup
1. Clone repository
   - cd CourseSelection

2. if using a virtual environment
   - virtualenv venv
   - Windows: venv/Scripts/activate.bat 
   - Bash: source venv/Scripts/activate

3. Install dependencies
   - cd coursepicker
   - pip install -r requirements.txt

4. Migrate databases
   - python manage.py makemigrations
   - python manage.py migrate

5. Collect static files
   - python manage.py collectstatic
   - yes

6. Run server
   - python manage.py runserver


Open Application at;
http://localhost:8000/webapp/index.html

Create courses at:
http://localhost:8000/webapp/index.html#!/create

#Examples

![Login Page](https://raw.githubusercontent.com/Dexeux/CourseSelection/master/Examples/login.PNG)
![Course Registration](https://raw.githubusercontent.com/Dexeux/CourseSelection/master/Examples/course-selection.PNG)

