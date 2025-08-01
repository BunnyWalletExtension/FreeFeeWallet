// Định nghĩa kiểu cho kết quả của hàm encryptSeed
interface EncryptionResult {
    encrypted: number[];
    salt: number[];
    iv: number[];
}

// Hàm tạo khóa AES từ mật khẩu sử dụng PBKDF2
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
    );
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
}

// Hàm mã hóa seed phrase
export async function encryptSeed(seed: string, password: string): Promise<EncryptionResult> {
    const salt: Uint8Array = crypto.getRandomValues(new Uint8Array(16));
    const iv: Uint8Array = crypto.getRandomValues(new Uint8Array(12));
    const key: CryptoKey = await deriveKey(password, salt);
    const encrypted: ArrayBuffer = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        key,
        new TextEncoder().encode(seed)
    );
    return {
        encrypted: Array.from(new Uint8Array(encrypted)),
        salt: Array.from(salt),
        iv: Array.from(iv),
    };
}

// Hàm giải mã seed phrase
export async function decryptSeed(
    encryptedData: number[],
    salt: number[],
    iv: number[],
    password: string
): Promise<string> {
    try {
        const key: CryptoKey = await deriveKey(password, new Uint8Array(salt));
        const decrypted: ArrayBuffer = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: new Uint8Array(iv),
            },
            key,
            new Uint8Array(encryptedData)
        );
        return new TextDecoder().decode(decrypted);
    } catch (error: unknown) {
        console.log(error);
        throw new Error("Mật khẩu không đúng hoặc dữ liệu bị hỏng");
    }
}

// export async function createWallet() {
//     const password = document.getElementById('password').value;
//     const confirmPassword = document.getElementById('confirm-password').value;
//     const seedPhraseField = document.getElementById('seed-phrase');
//     const errorMessage = document.getElementById('create-error');
//     const successMessage = document.getElementById('create-success');

//     // Reset messages
//     errorMessage.style.display = 'none';
//     successMessage.style.display = 'none';
//     seedPhraseField.value = '';

//     // Validate password
//     if (password.length < 8) {
//         errorMessage.textContent = 'Mật khẩu phải dài ít nhất 8 ký tự';
//         errorMessage.style.display = 'block';
//         return;
//     }

//     if (password !== confirmPassword) {
//         errorMessage.textContent = 'Mật khẩu xác nhận không khớp';
//         errorMessage.style.display = 'block';
//         return;
//     }

//     // Password strength check
//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     if (!passwordRegex.test(password)) {
//         errorMessage.textContent = 'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt';
//         errorMessage.style.display = 'block';
//         return;
//     }

//     try {
//         // Tạo ví Solana
//         const wallet = Keypair.generate();
//         const seedPhrase = ethers.utils.entropyToMnemonic(wallet.secretKey.slice(0, 32)); // Tạo seed phrase từ entropy

//         // Mã hóa seed phrase
//         const { encrypted, salt, iv } = await encryptSeed(seedPhrase, password);

//         // Lưu trữ cục bộ
//         localStorage.setItem('owallet_encrypted_seed', JSON.stringify({
//             encrypted: encrypted,
//             salt: salt,
//             iv: iv,
//             address: wallet.publicKey.toString()
//         }));

//         // Hiển thị seed phrase
//         seedPhraseField.value = seedPhrase;
//         successMessage.textContent = 'Ví OWallet đã được tạo! Lưu seed phrase an toàn!';
//         successMessage.style.display = 'block';

//         // Clear form
//         document.getElementById('password').value = '';
//         document.getElementById('confirm-password').value = '';
//     } catch (error) {
//         errorMessage.textContent = 'Có lỗi xảy ra khi tạo ví: ' + error.message;
//         errorMessage.style.display = 'block';
//     }
// }

// async function loginWallet() {
//     const loginPassword = document.getElementById('login-password').value;
//     const errorMessage = document.getElementById('login-error');
//     const successMessage = document.getElementById('login-success');

//     // Reset messages
//     errorMessage.style.display = 'none';
//     successMessage.style.display = 'none';

//     const storedData = localStorage.getItem('owallet_encrypted_seed');
//     if (!storedData) {
//         errorMessage.textContent = 'Ví chưa được tạo. Vui lòng tạo ví trước!';
//         errorMessage.style.display = 'block';
//         return;
//     }

//     try {
//         const { encrypted, salt, iv, address } = JSON.parse(storedData);
//         // Giải mã seed phrase
//         const seedPhrase = await decryptSeed(encrypted, salt, iv, loginPassword);

//         // Tái tạo ví từ seed phrase
//         const entropy = ethers.utils.mnemonicToEntropy(seedPhrase);
//         const wallet = Keypair.fromSecretKey(Uint8Array.from(Buffer.from(entropy, 'hex')));

//         if (wallet.publicKey.toString() === address) {
//             successMessage.textContent = `Đăng nhập thành công! Địa chỉ ví: ${wallet.publicKey.toString()}`;
//             successMessage.style.display = 'block';
//             document.getElementById('login-password').value = '';
//         } else {
//             errorMessage.textContent = 'Mật khẩu không đúng';
//             errorMessage.style.display = 'block';
//         }
//     } catch (error) {
//         errorMessage.textContent = 'Đăng nhập thất bại: ' + error.message;
//         errorMessage.style.display = 'block';
//     }
// }

// async function restoreWallet() {
//     const seedPhrase = document.getElementById('restore-seed').value.trim();
//     const errorMessage = document.getElementById('restore-error');
//     const successMessage = document.getElementById('restore-success');

//     // Reset messages
//     errorMessage.style.display = 'none';
//     successMessage.style.display = 'none';

//     try {
//         // Kiểm tra seed phrase hợp lệ
//         if (!ethers.utils.isValidMnemonic(seedPhrase)) {
//             errorMessage.textContent = 'Seed phrase không hợp lệ';
//             errorMessage.style.display = 'block';
//             return;
//         }

//         // Tái tạo ví từ seed phrase
//         const entropy = ethers.utils.mnemonicToEntropy(seedPhrase);
//         const wallet = Keypair.fromSecretKey(Uint8Array.from(Buffer.from(entropy, 'hex')));

//         // Lưu trữ tạm thời
//         localStorage.setItem('owallet_encrypted_seed', JSON.stringify({
//             encrypted: [],
//             salt: [],
//             iv: [],
//             address: wallet.publicKey.toString()
//         }));

//         successMessage.textContent = `Khôi phục ví thành công! Địa chỉ ví: ${wallet.publicKey.toString()}`;
//         successMessage.style.display = 'block';
//         document.getElementById('restore-seed').value = '';
//     } catch (error) {
//         errorMessage.textContent = 'Khôi phục thất bại: ' + error.message;
//         errorMessage.style.display = 'block';
//     }
// }