import time 
from selenium import webdriver
from selenium.webdriver.common.by import By

print("=Registration page testing below=")

driver = webdriver.Chrome()

driver.get("http://localhost:3000/signup")
title = driver.title
driver.implicitly_wait(0.5)

elements = driver.find_elements(By.TAG_NAME, 'button')
# print("elements:", elements)
for e in elements:
    print("E: ",e.text, " Type: ", type(e))
    if(e.text == ""):
        print("===I was nothing===")
time.sleep(2)

driver.quit()

print("===Registration page testing is now over===")