import seaborn as sns
from sklearn.ensemble import RandomForestClassifier
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import re
import nltk
from sklearn.model_selection import train_test_split
import joblib
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer

dataset = pd.read_csv("./Dataset/cyberbullying_tweets.csv",skipinitialspace=True)
dataframe=pd.DataFrame(dataset)
unique_cyberbullying_type=dataframe["cyberbullying_type"].unique()
unique_cyberbullying_type_values=unique_cyberbullying_type.tolist()
unique_cyberbullying_type_values
# encoding labels
counter=0
for i in unique_cyberbullying_type_values:
    dataframe=dataframe.replace(i,counter)
    counter=counter+1

#Creating Bag Of Words
nltk.download('stopwords')
corpus = []
for i in range(0, 47692):
  review = re.sub('[^a-zA-Z]', ' ', dataframe['tweet_text'][i])
  review = review.lower()
  review = review.split()
  ps = PorterStemmer()
  all_stopwords = stopwords.words('english')
  all_stopwords.remove('not')
  review = [ps.stem(word) for word in review if not word in set(all_stopwords)]
  review = ' '.join(review)
  corpus.append(review)
df=pd.DataFrame(corpus)
# all_stopwords = stopwords.words('english')
# all_stopwords.remove('not')


from sklearn.feature_extraction.text import CountVectorizer
cv = CountVectorizer(max_features=1500)
X = df[0]
y = dataframe.loc[:,"cyberbullying_type"].values
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.20, random_state = 0)


###################################################################################################################

# X_train = X_train.reshape(X_train.shape + (1,))
# X_test = X_test.reshape(X_test.shape + (1,))
# y_train = np.asarray(y_train).astype('float32').reshape((-1,1))
# y_test = np.asarray(y_test).astype('float32').reshape((-1,1))

# import tensorflow as tf
# from tensorflow.keras.models import Sequential
# from tensorflow.keras.layers import Dense,Dropout,LSTM,BatchNormalization
# from tensorflow.keras.callbacks import TensorBoard,ModelCheckpoint
# model=Sequential()

# model.add(LSTM(128,activation='relu',input_shape=(X_train.shape[1:]),return_sequences=True))
# model.add(Dropout(0.2))
# model.add(BatchNormalization())

# model.add(LSTM(128,activation='relu',input_shape=(X_train.shape[1:]),return_sequences=True))
# model.add(Dropout(0.2))
# model.add(BatchNormalization())

# model.add(LSTM(128,activation='relu',input_shape=(X_train.shape[1:])))
# model.add(Dropout(0.2))
# model.add(BatchNormalization())

# model.add(Dense(32,activation="relu"))
# model.add(Dropout(0.2))

# model.add(Dense(6,activation='softmax'))

# model.compile(loss='sparse_categorical_crossentropy',optimizer='adam',metrics=['accuracy'])

# model.fit(X_train,y_train,batch_size=32,epochs=10,validation_data=(X_test,y_test))

########################################################################################################################################################
cv.fit(X_train)
# joblib.dump(cv,"CountVectorizer")
cv_train  = cv.transform(X_train).toarray()
cv_test = cv.transform(X_test).toarray()



# classifier = RandomForestClassifier(n_estimators = 10, criterion = 'entropy', random_state = 0)
# classifier.fit(cv_train, y_train)



# y_pred = classifier.predict(cv_test)
#print(np.concatenate((y_pred.reshape(len(y_pred),1), y_test.reshape(len(y_test),1)),1))




from sklearn.metrics import confusion_matrix, accuracy_score
# cm = confusion_matrix(y_test, y_pred)
# print(cm)
# accuracy_score(y_test, y_pred)

# sns.heatmap(cm,annot=True)
classifier=joblib.load("classifier")
comment=input("Enter a string to be checked for detection :")
print(comment)
lst=[]
lst.append(comment)

review_comment = re.sub('[^a-zA-Z]', ' ', lst[0])
review_comment = review_comment.lower()
review_comment = review_comment.split()
ps = PorterStemmer()
all_stopwords = stopwords.words('english')
all_stopwords.remove('not')
print(review_comment)
review_comment = [ps.stem(word) for word in review_comment if not word in set(all_stopwords)]
print(review_comment)
review_comment = ' '.join(review_comment)
print(review_comment)


review_comment_array=cv.transform([review_comment]).toarray()
y_pred_comment=classifier.predict(review_comment_array)


print(unique_cyberbullying_type_values[y_pred_comment[0]])

print(unique_cyberbullying_type_values)