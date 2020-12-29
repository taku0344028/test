class UserProfile {
    imgSrc: string = '';
    name: string = '大久保 拓也';
    reAuthEmail: string = 'hogehoge@google.com';
}

const getUserProfile = (): UserProfile => {
    return new UserProfile();
}

const supportsHTML5Storage = (): boolean => {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    }
    catch (e) {
        return false;
    }
}

const loadProfile = (callback: (profile: UserProfile) => void) => {
    if (!supportsHTML5Storage()) return false;
    const profile = getUserProfile();
    callback(profile);
}

window.addEventListener('load', () => {
    loadProfile((profile) => {
        if (document) {
            (document.getElementById('profile-name') as HTMLParagraphElement).innerText = profile.name;
            (document.getElementById('inputEmail') as HTMLInputElement).value = profile.reAuthEmail;
            if (profile.reAuthEmail !== '') {
                (document.getElementById('inputPassword') as HTMLInputElement).focus();
            }
        }
    });
});

// This file ends here.