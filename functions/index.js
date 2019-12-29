const functions = require('firebase-functions');
const admin = require('firebase-admin');


admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

exports.messagesnotification = functions.firestore.document(
    'messages_center/{currentUserId1}/{currentUserId2}/{otherUserId}'
).onCreate((snapshot, context) => {
    var userInfo = snapshot.data();

    console.log("The user found in like trigger function");
    console.log(userInfo.userToken);

    userToken = userInfo.userToken;
    fromUserName = userInfo.fromUserName;
    content = userInfo.content;
    idFrom = userInfo.idFrom;
    idTo = userInfo.idTo;

    var notificationRef = db.collection('notification_on_off').doc(idTo).collection(idTo).doc(idFrom)
    notificationRef.get().then(doc => {
        if (!doc.exists) {
            console.log('No such User document!');
        }
        else {

            if (doc.data().notification == "on") {
                console.log("notification on");
                var payload = {
                    "notification": {
                        "title": fromUserName,
                        "body": content,
                        "sound": "default"
                    },
                    "data": {
                        "sendername": fromUserName,
                        "message": content
                    }
                }

                return admin.messaging().sendToDevice(userToken, payload);
            }
            else {
                console.log("notification off");
            }
        }

    });
});
