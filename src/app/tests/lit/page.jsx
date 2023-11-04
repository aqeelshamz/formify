"use client";
import crypto from "crypto";
import { useEffect } from "react";

export default function Test() {


  useEffect(() => {
    var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
    var key = '1234567890';
    var text = 'I love kittens';

    var cipher = crypto.createCipher(algorithm, key);
    var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    var decipher = crypto.createDecipher(algorithm, key);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
    console.log("encrypted", encrypted);
    console.log(decrypted);
  }, [])

  return (
    <div className="m-5">
      <h1>RSA</h1>
      <button className="btn btn-primary">
        Encrypt
      </button>
    </div>
  );
}
