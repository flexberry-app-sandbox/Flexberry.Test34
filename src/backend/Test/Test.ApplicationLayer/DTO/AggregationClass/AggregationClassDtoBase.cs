namespace Test.ApplicationLayer.DTO.AggregationClass
{
    using System;
    using Test;

    /// <summary>
    /// Базовое DTO для AggregationClass.
    /// </summary>
    public class AggregationClassDtoBase
    {
        /// <summary>
        /// Id.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Заполняет ДТО данными из переданного объекта.
        /// </summary>
        /// <param name="source">Объект с данными.</param>
        /// <returns>Полученное ДТО.</returns>
        public virtual AggregationClassDtoBase FillFromClass(AggregationClass source)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Заполняет переданный объект данными из ДТО.
        /// </summary>
        /// <param name="destination">Объект для обновления.</param>
        public virtual void UpdateFromDto(AggregationClass destination)
        {
            throw new NotImplementedException();
        }
    }
}
