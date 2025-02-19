package web.hub.audio.dao.repository.five9;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.io.Serializable;
import java.util.List;

@Repository
public class Five9CallSegmentsNoCountRepository {

    @PersistenceContext
    protected EntityManager em;

    public <T, ID extends Serializable> Page<T> findAll(Specification<T> spec, Pageable pageable, Class<T> clazz) {
        SimpleJpaNoCountRepository<T, ID> noCountDao = new SimpleJpaNoCountRepository<T, ID>(clazz, em);
        return noCountDao.findAll(spec, pageable);
    }

    /**
     * Custom repository that disable count query.
     */
    public static class SimpleJpaNoCountRepository<T, ID extends Serializable> extends SimpleJpaRepository<T, ID> {

        public SimpleJpaNoCountRepository(Class<T> domainClass, EntityManager em) {
            super(domainClass, em);
        }

        @NotNull
        @Override
        protected <S extends T> Page<S> readPage(TypedQuery<S> query, @NotNull final Class<S> domainClass, Pageable pageable,
                                                 @Nullable Specification<S> spec) {
            query.setFirstResult((int) pageable.getOffset());
            query.setMaxResults(pageable.getPageSize());
            List<S> content = query.getResultList();
            return new PageImpl<S>(content, pageable, content.size());
        }
    }
}
