import pandas as pd
def read_dbcsv(filename):
    df = pd.read_csv('users.csv')
    return df
