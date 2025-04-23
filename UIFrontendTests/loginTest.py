import time 
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

print("=Login page testing below=")

driver = webdriver.Chrome()

driver.get("http://localhost:3000/login")
title = driver.title
driver.implicitly_wait(0.5)

elements = driver.find_elements(By.TAG_NAME, 'input')
print("elements:", elements)
testnum = 0

time.sleep(2)
# This will change when I give out id in my code
for e in elements:
    if(testnum == 0):
        print("Setting Email")
        e.send_keys("jane.doe@example.com")
        time.sleep(2)
    if(testnum == 1):
        print("Setting password")
        e.send_keys("password-goes-here")
        time.sleep(2)
    testnum+=1

buttons = driver.find_elements(By.TAG_NAME, 'button')
print("Buttons?: ", buttons)
for b in buttons:
    print("b: ",b.text, " Type: ", type(b))
    b.click()
#buttons[0].click()
time.sleep(2)
print("Before alert click?")

try:
    alert = driver.switch_to.alert
    print("Alert text:", alert.text)
    alert.accept()  # Accept the alert (click OK)
except:
    print("The login was a failure")
    pass  # No alert present, continue
#element = driver.find_element(By.LINK_TEXT, "Login Successful") This shit was just broken and wrong
#element.click()
print("after alert click?")
time.sleep(2)

# This is the just because i'm using chrome
try:
    passwordBox = driver.switch_to.alert
    print("Alert text:", passwordBox.text)
    passwordBox.accept()  # Accept the alert (click OK)
except:
    print("There was no password leaked")
    pass  # No alert present, continue

time.sleep(5)

driver.quit()

print("===Login page testing is now over===")