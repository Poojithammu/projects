import streamlit as st
import joblib
import numpy as np

model = joblib.load("model.pkl")

st.title("House price prediction app")

st.divider()

st.write("This app uses amchine learning for predicting house price with given features of the house. For using this app you can enter inputs from this UI and then use predict button.")

st.divider()

bedrooms = st.number_input("Number of bedrooms", min_value = 0, value = 0)
bathrooms = st.number_input("Number of bathrooms", min_value = 0, value = 0)
livingarea = st.number_input("Living area", min_value = 0, value = 2000)
condition = st.number_input("Condition", min_value = 0, value = 3)
numberofschools = st.number_input("Number of schools nearby", min_value = 0, value = 0)

st.divider()

x = [[bedrooms, bathrooms, livingarea, condition, numberofschools]]

predictbutton = st.button("Predict!")

if predictbutton:

    st.balloons()

    x_array = np.array(x)

    prediction = model.predict(x_array)[0]

    st.write(f"Price prediction is {prediction:,.2f}")

else:
    st.write("Please use predict button after entering values")