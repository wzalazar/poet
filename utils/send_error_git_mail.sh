#!/bin/bash 

HOSTNAME="localhost" 
credentials="$( echo -ne "\000esteban@po.et\000password" | base64)"
mailfrom="esteban@po.et" 
mailto="eordano@gmail.com" 
subject="Problem processing \"git pull\" on poet.host" 

emailHTMLStr="\n 
\n 

Problem when fetching commit $1

\n 
" 

newline=$'\012' 

function err_exit() { echo -e 1>&2; exit 1; } 

function body() {
  echo -ne "Content-type: text/html\r\n" 
  echo -ne "From: <${mailfrom}>\r\n" 
  echo -ne "To: <${mailto}>\r\n" 
  echo -ne "Subject: ${subject}\r\n" 
  echo -ne "\r\n" 
  echo -ne ${emailHTMLStr}"\r\n" 
}

function mail_input { 
  (sleep 0.1 && echo -e "ehlo ${HOSTNAME}") &
  (sleep 0.5 && echo -e "auth plain ${credentials}" ) &
  (sleep 1.0 && echo -e "mail from: <${mailfrom}>") &
  (sleep 1.5 && echo -e "rcpt to: <${mailto}>" ) &
  (sleep 2.0 && echo -e "data" )&
  (sleep 3.5 && body) &
  (sleep 4.6 && echo -e "." )&
  (sleep 8.0 && echo -ne "quit")&
} 

mail_input | openssl s_client -connect smtp.gmail.com:465 -crlf || err_exit
