# CatraComputer

Universidad Nacional Autonoma de Honduras

Hecho por: Alejandro Claros, Clase de Arquitectura de Computadores, año 2018. 

CatraComputer es un proyecto escrito en JavaScript que consiste en simular una computadora usando un lenguaje especial de bajo nivel, este lenguaje tiene la característica de usar solamente números en sus instrucciones. El objetivo principal es desarrollar programas de bajo nivel usando dicho lenguaje.


## Documentación

Posee 4 botones, en orden descendente:

* **Boton de engranajes** - Es el botón de compilar, permite depurar el código.
* **Boton de reinicio** - Es el botón para reiniciar la ejecución del programa.
* **Boton de escribir** - Es el botón de modificar memoria, permite modificar la palabra contenida en una dirección de memoria.
* **Boton de siguiente** - Es el botón de ejecutar una instrucción a la vez.
* **Boton de adelantar** - Es el botón de ejecutar todas las instrucciones de manera automática en forma secuencial.


Posee 2 ventanas modales:

*Ventana de lectura*: Aparecerá cuando una instrucción de lectura sea procesada, pedirá ingresar un número perteneciente al conjunto de los enteros (Z) acotado en el rango de -99999 a 99999.

*Ventana de modificar memoria*: Aparecerá cuando se presione el botón de escribir, pedirá una dirección y un contenido.
Al momento de ingresar los datos el programa rellena automáticamente con ceros a la izquierda.
Es importante recalcar que, debe evitarse el uso de espacios (" ") en las instrucciones, 
ya el el compilador los detecta con el mensaje: "Error: La instrucción "" debe ser de 5 digitos."
Para borrar las instrucciones del area de texto, basta con darle click, presionar "ctrl + a" despues "delete o supr". 


### Algunos programas:

Suma dos numeros (a, b) y muestra el resultado en la consola (lee a luego b):

10010

10011

20010

30011

21011

11011

43000


Resta dos numeros (a, b) y muestra los resultados en la consola (lee a luego b):

10010

10011

20010

31011

21011

11011

43000


Multiplica dos numeros (a, b) y muestra los resultados en la consola (lee a luego b):

10010

10011

20010

33011

21011

11011

43000


Divide dos numeros (a, b) y muestra los resultados en la consola (lee a luego b):

10010

10011

20010

32011

21011

11011

43000


Bifurca a una direccion:

40002

10000

11000

43000


Bifurca a una direccion si acumulador es negativo (es necesario que el dato ingresado sea negativo para probar):

10010

20010

41004

10000

11000

43000


Bifurca a una direccion si acumulador es igual a cero:

42002

10000

11000

43000


Leer 3 numeros (a, b, c) y mostrar su suma (lee a, b y c usando un ciclo):

10014

20014

41000

30015

21015

20012

31013

21012

42010

40000

11015

43000


Tambien se debe modificar la memoria, usando el boton de editar:

direccion:	012

contenido:	00003

direccion:	013

contenido:	00001


Usar un ciclo para leer 7 numeros algunos positivos otros negativos, calcular e imprimir su promedio:

10019

20019

30020

21020

20021

30018

21021

20017

31018

21017

42012

40000

20020

32021

21022

11022

43000


Tambien se debe modificar la memoria, usando el boton de editar:

direccion:	017 

contenido:	00007

direccion:	018

contenido:	00001


Leer una serie de numeros, determinar e imprimir el numero mas grande. El primer numero leido indica cuantos numeros deben procesarse:

10014

10016

20016

31017

41007

20016

21017

20014

31015

21014

42012

40001

11017

43000


Tambien se debe modificar la memoria, usando el boton de editar:

direccion:	015 

contenido:	00001


Encontrar el cuadrado de un numero (lee a):

10010

20010

33010

21011

11011

43000


Dividir a/b, almacene la parte entera y n digitos (n=1 si c=10, n=2 si c=100, n=3 si c=1000, n=4 si c=10000) de la parte decimal (lee a luego b y por ultimo c):

10100

10101

10102

20100

32101

21103

33102

21104

20100

33102

32101

31104

21105

11103

11105

43000


