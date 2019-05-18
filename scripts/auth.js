//add admin cloud function
const adminForm = document.querySelector('.admin-actions');
adminForm.addEventListener('submit', e =>{
    e.preventDefault();
    const adminEmail = document.querySelector('#admin-email').value;
    const addAdminRole = functions.httpsCallable('addAdminRole');
    addAdminRole({email: adminEmail}).then(result =>{
        console.log(result);
        adminForm.reset();
    });
})

//listen for auth status changes
auth.onAuthStateChanged(user => {
    if(user){
       //get data from db
       user.getIdTokenResult().then(idTokenResult => {
          user.admin = idTokenResult.claims.admin;
          setupUi(user);
       })
        db.collection('guides').onSnapshot(snapshot => {
            setupguides(snapshot.docs);
        }, err => {
            console.log("Need to Log in");
        });
    }else{
        setupUi();
        setupguides([]);
    }
});                             

//create new guides
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', e =>{
    e.preventDefault();
    db.collection('guides').add({
        title: createForm['title'].value,
        content: createForm['content'].value
    }).then( () => {
        const modal = document.querySelector('#modal-create');
        M.Modal.getInstance(modal).close();
        createForm.reset();
    }).catch(e =>{
        console.log(e.message);
    })
})

//signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //get user info
    const email = signupForm['signup-email'].value;
    const pass = signupForm['signup-password'].value;
    
    //sign up with user
    auth.createUserWithEmailAndPassword(email, pass).then( cred => {
        return db.collection('users').doc(cred.user.uid).set({
            bio: signupForm['signup-bio'].value
        });
    }).then(() => {
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
        signupForm.querySelector('.error').innerHTML = '';
    }).catch(err => {
        signupForm.querySelector('.error').innerHTML = err.message;
    });
});

//logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', e =>{
    e.preventDefault();
    auth.signOut();
})

//login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = loginForm['login-email'].value;
    const pass = loginForm['login-password'].value;
    
    auth.signInWithEmailAndPassword(email, pass).then(cred => {
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
        loginForm.querySelector('.error').innerHTML = '';
    }).catch(err => {
        loginForm.querySelector('.error').innerHTML = err.message;
    })
})