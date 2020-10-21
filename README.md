# JMeterAPI

Load, Soak, Spike and Stress testing conducted on the To-Do-List-Web-App using JMeter. JMX files, html reports and csv results generated can be found in thier respective folders.

Test Plans written to test CRUD functionality of the web app for both the tasklist and task entities, seperated by logic controllers for each entity to make the test cases more
readable between them.

Average thread count was taken to be 500 and peak thread count was 1000. Testing timescale was 90 seconds for each test.

Majority of errors were caused by the duration assertion, especially for the Spike test were the load was so great over a small period of time requiring the web api to need more
time to retrieve the request. Throuput was alread negativly affected for the same reasons an showed itself most clearly in the spike and stress tests. 
