(ns transactions.core
  (:gen-class))

(type false)

(defn -main
  "I don't do a whole lot ... yet."
  [& args]
  (println "Hello, World!" args)
  (println
    (nth
      (cons
        2 (list 1 2 3)
      )
      0
    ) 
  )
)
